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
        public ActionResult<Project> GetProject(int id)
        {
            if (!_context.Projects.Any(p => p.ProjectId == id))
            {
                return NotFound();
            }

            return _context.Projects.First(p => p.ProjectId == id);
        }

        [HttpPost]
        public ActionResult<Project> CreateProject(Project project)
        {
            if (project == null)
            {
                return BadRequest();
            }

            _context.Projects.Add(project);
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProject(int id, Project project)
        {
            if (project == null || id != project.ProjectId)
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
            if (_context.Projects == null || !_context.Projects.Any(p => p.ProjectId == id))
            {
                return NotFound();
            }
            Project project = _context.Projects.First(p => p.ProjectId == id);

            _context.Projects.Remove(project);
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }
    }
}
