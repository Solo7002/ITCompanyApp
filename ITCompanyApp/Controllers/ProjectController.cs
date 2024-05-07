using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DBContext _context;

        public ProjectController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Project> GetProjects()
        {
            return _context.Projects.ToList();
        }

        [HttpGet("{id}")]
        public Project GetProject(int id)
        {
            return _context.Projects.FirstOrDefault(p => p.ProjectId == id);
        }

        [HttpPost]
        public ActionResult<Project> PostProject(Project project)
        {
            _context.Projects.Add(project);
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }

        [HttpPut("{id}")]
        public IActionResult PutProject(int id, Project project)
        {
            if (id != project.ProjectId)
            {
                return BadRequest();
            }

            _context.Entry(project).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            if (_context.Projects == null)
            {
                return NotFound();
            }
            Project project = _context.Projects.FirstOrDefault(p => p.ProjectId == id);
            if (project == null)
            {
                return NotFound();
            }

            _context.Projects.Remove(project);
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }
    }
}
