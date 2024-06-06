using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Security.Cryptography.Xml;

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
            else if (model.DeadLineProjectDate <= DateTime.Now)
            {
                return BadRequest("DeadLine incorrect");
            }
            Project project = new Project
            {
                ProjectName = model.ProjectName,
                Description = model.Description,
                File = model.File,
                IsDone = model.IsDone,
                StartProjectDate = DateTime.Now,
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
            else if (model.DeadLineProjectDate <= DateTime.Now)
            {
                return BadRequest("DeadLine incorrect");
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

            return Ok();
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

            return Ok();
        }

        [HttpGet]
        [Route("getEmployeeInProject/{id}")]
        public ActionResult<IEnumerable<EmployeeViewModel>> GetEmployeeInProjectById(int id)
        {
            if (_context.Projects == null || !_context.Projects.Any(p => p.ProjectId == id))
            {
                return BadRequest();
            }
            Project project = _context.Projects.First(p => p.ProjectId == id);
            List<Models.Task> task = _context.Tasks.Where(t=>t.ProjectId==project.ProjectId).ToList();
            List<EmployeeViewModel> employees =new List<EmployeeViewModel>();
            foreach (Models.Task item in task)
            {
                Employee employee = _context.Employees.First(e => e.Id == item.EmployeeFor_Id);
                employees.Add(new EmployeeViewModel
                {
                    LastName=employee.LastName,
                    FirstName=employee.FirstName,
                    BirthDate=employee.BirthDate,
                    Email=employee.Email,
                    PhoneNumber=employee.PhoneNumber,
                    PhotoFile=employee.PhotoFile,
                    Salary=employee.Salary,
                    DepartmentId=employee.DepartmentId,
                    JobId=employee.JobId
                });
            }
            
            return Ok(employees.Distinct());
        }
        [HttpGet("getTasksInProject/{id}")]
       
        public ActionResult<IEnumerable<TaskViewModel>> GetTasksInProjectById(int id)
        {
            if (_context.Projects == null || !_context.Projects.Any(p => p.ProjectId == id)|| _context.Tasks==null)
            {
                return BadRequest();
            }
            Project project = _context.Projects.First(p => p.ProjectId == id);
           List<TaskViewModel> tasks =_context.Tasks.Where(t=> t.ProjectId.Value == project.ProjectId).Select(t=>new TaskViewModel{
               DeadLineDate=t.DeadLineDate,
               Text=t.Text,
               Header=t.Header,
               File=t.File,
               DoneFile=t.File,
               Cover=t.Cover,
               IsDone=t.IsDone,
               ProjectId=t.ProjectId,
               EmployeeFor_Id=t.EmployeeFor_Id,
               EmployeeFrom_Id=t.EmployeeFrom_Id

           }).ToList();
            return Ok(tasks);
        }
        [HttpGet]
        [Route("getProjectInYear")]
        public IEnumerable<int> GetComplitedProjectInYear()
        {
            if (_context.Projects == null)
            {
                return null;
            }
            List<Project> projects = _context.Projects.Where(p => p.IsDone).Where(p => p.DeadLineProjectDate.Year == DateTime.Now.Year).OrderBy(p=>p.DeadLineProjectDate).ToList();
            var results = projects.GroupBy(e => e.DeadLineProjectDate.Month).Select(e => new
            {
                Month = e.Key,
                Count = e.Count()
            });
            int[] monthlyProjectCounts = new int[12];
            foreach (var result in results)
            {
                monthlyProjectCounts[result.Month - 1] = result.Count;
            }
            return monthlyProjectCounts;
        }
    }
}
