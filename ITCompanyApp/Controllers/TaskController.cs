using ITCompanyApp.Helpers.DBClasses;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DBContext _context;

        public TaskController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Models.Task> GetTasks()
        {
            return _context.Tasks.ToList();
        }

        [HttpGet("{id}")]
        public Models.Task GetTask(int id)
        {
            return _context.Tasks.FirstOrDefault(t => t.TaskId == id);
        }

        [HttpPost]
        public ActionResult<Models.Task> PostTask(Models.Task task)
        {
            _context.Tasks.Add(task);
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }

        [HttpPut("{id}")]
        public IActionResult PutTask(int id, Models.Task task)
        {
            if (id != task.TaskId)
            {
                return BadRequest();
            }

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            if (_context.Tasks == null)
            {
                return NotFound();
            }
            Models.Task task = _context.Tasks.FirstOrDefault(t => t.TaskId == id);
            if (task == null)
            {
                return NotFound();
            }

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }
    }
}
