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
        public ActionResult<Models.Task> GetTask(int id)
        {
            if (!_context.Tasks.Any(t => t.TaskId == id))
            {
                return NotFound();
            }

            return _context.Tasks.First(t => t.TaskId == id);
        }

        [HttpGet("employeeFor/{id}")]
        public ActionResult<IEnumerable<Models.Task>> GetTasByEmployeeeForId(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return Ok(_context.Tasks.Where(t => t.EmployeeFor_Id == null || t.EmployeeFor_Id == id));
        }

        [HttpPost]
        public ActionResult<Models.Task> CreateTask(TaskViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if ((model.EmployeeFor_Id != null && !_context.Employees.Any(e => e.Id == model.EmployeeFor_Id)) || !_context.Employees.Any(e => e.Id == model.EmployeeFrom_Id))
            {
                return BadRequest("No employees with such id");
            }

            Models.Task task = new Models.Task 
            {
                Header = model.Header,
                Text = model.Text,
                File = model.File,
                Cover = model.Cover,
                IsDone = model.IsDone,
                UploadDate = DateTime.Now,
                DeadLineDate = model.DeadLineDate,
                Project=_context.Projects.First(e=>e.ProjectId==model.ProjectId),
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFrom_Id)
            };
            _context.Tasks.Add(task);
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, TaskViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Tasks.Any(t => t.TaskId == id))
            {
                return NotFound();
            }
            else if (!_context.Employees.Any(e => e.Id == model.EmployeeFor_Id) || !_context.Employees.Any(e => e.Id == model.EmployeeFrom_Id))
            {
                return BadRequest("No employees with such id");
            }

            Models.Task task = new Models.Task
            {
                TaskId = id,
                Header = model.Header,
                Text = model.Text,
                File = model.File,
                Cover = model.Cover,
                IsDone = model.IsDone,
                UploadDate = DateTime.Now,
                DeadLineDate = model.DeadLineDate,
                EmployeeFor = _context.Employees.First(e => e.Id == model.EmployeeFor_Id),
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFrom_Id)
            };

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }

        [HttpPut("setDone/{id}")]
        public IActionResult setDoneTask(int id)
        {
            if (!_context.Tasks.Any(t => t.TaskId == id))
            {
                return NotFound();
            }

            Models.Task task = _context.Tasks.First(t => t.TaskId == id);
            task.IsDone = true;
            task.DoneDate = DateTime.Now;

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteProject(int id)
        {
            if (_context.Tasks == null || !_context.Tasks.Any(t => t.TaskId == id))
            {
                return NotFound();
            }
            Models.Task task = _context.Tasks.First(t => t.TaskId == id);

            _context.Tasks.Remove(task);
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }
    }
}
