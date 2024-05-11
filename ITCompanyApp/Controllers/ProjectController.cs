using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        public ActionResult<Project> CreateProject(ProjectViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Employees.Any(e => e.Id == model.EmployeeId))
            {
                return BadRequest("No employees with such id");
            }

            Project project = new Project
            {
                ProjectName = model.ProjectName,
                Description = model.Description,
                File = model.File,
                IsDone = model.IsDone,
                StartProjectDate = model.StartProjectDate,
                DeadLineProjectDate = model.DeadLineProjectDate,
                EmployeeProjectHead = _context.Employees.First(e => e.Id == model.EmployeeId)
            };

            _context.Projects.Add(project);
            _context.SaveChanges();

            return RedirectToAction("GetProjects");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateProject(int id, ProjectViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Projects.Any(p => p.ProjectId == id))
            {
                return NotFound();
            }
            else if (!_context.Employees.Any(e => e.Id == model.EmployeeId))
            {
                return BadRequest("No employees with such id");
            }

            Project project = new Project
            {
                ProjectId = id,
                ProjectName = model.ProjectName,
                Description = model.Description,
                File = model.File,
                IsDone = model.IsDone,
                StartProjectDate = model.StartProjectDate,
                DeadLineProjectDate = model.DeadLineProjectDate,
                EmployeeProjectHead = _context.Employees.First(e => e.Id == model.EmployeeId)
            };

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
