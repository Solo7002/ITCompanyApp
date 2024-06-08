using Microsoft.AspNetCore.Mvc;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        private string _directoryPath = Path.Combine(Directory.GetCurrentDirectory(), "bin", "UserFiles");
        private List<string> _folders = new List<string> 
        {
            "tasks/task_covers", "tasks/task_files",
            "projects/project_covers", "projects/project_files",
            "users/images"
        };

        public FilesController()
        {
            foreach (string folder in _folders) 
            {
                if (!Directory.Exists(Path.Combine(_directoryPath, folder)))
                {
                    Directory.CreateDirectory(Path.Combine(_directoryPath, folder));
                }
            }
        }

        [HttpPost("upload/{folder1Name}/{folder2Name}")]
        public IActionResult UploadFile(string folder1Name, string folder2Name, IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            string newFileName = (file.FileName.Split('.')[0] + DateTime.Now.ToLongTimeString()).GetHashCode() + "." + file.FileName.Split('.')[1];
            string filePath = Path.Combine(_directoryPath, folder1Name, folder2Name, newFileName);

            using (var memoryStream = new MemoryStream())
            {
                file.CopyTo(memoryStream);
                System.IO.File.WriteAllBytes(filePath, memoryStream.ToArray());
            }

            return Ok(new { folderFile = $"/{folder1Name}/{folder2Name}/{newFileName}" }); ;
        }



        [HttpGet("download/{folder1Name}/{folder2Name}/{fileName}")]
        public IActionResult DownloadFile(string folder1Name, string folder2Name, string fileName)
        {
            string filePath = Path.Combine(_directoryPath, folder1Name, folder2Name, fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("No files with such name");
            }

            byte[] data = System.IO.File.ReadAllBytes(filePath);
            return File(data, "application/octet-stream", fileName);
        }
    }
}
