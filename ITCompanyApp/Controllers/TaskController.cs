﻿using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models.SpecialModels.Tasks;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
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
        public ActionResult<IEnumerable<Models.Task>> GetTaskByEmployeeForId(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return Ok(_context.Tasks.Where(t => t.EmployeeFor_Id == null || t.EmployeeFor_Id == id));
        }

        [HttpGet("employeeFor/{id_for}/employeeFrom/{id_from}")]
        public ActionResult<IEnumerable<Models.Task>> GetTaskByEmployeeForIdAndFromId(int id_for, int id_from)
        {
            if (!_context.Employees.Any(e => e.Id == id_for) || !_context.Employees.Any(e => e.Id == id_from))
            {
                return NotFound();
            }

            return Ok(_context.Tasks.Where(t => t.EmployeeFrom_Id == id_from && (t.EmployeeFor_Id == null || t.EmployeeFor_Id == id_for)));
        }

        [HttpPost]
        public ActionResult<Models.Task> CreateTask(TaskViewModel model)
        {
            model.DoneFile = "";
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
                DoneFile = model.DoneFile,
                Cover = model.Cover,
                IsDone = model.IsDone,
                UploadDate = DateTime.Now,
                DeadLineDate = model.DeadLineDate,
                Project = _context.Projects.First(e=>e.ProjectId==model.ProjectId),
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFrom_Id),
                EmployeeFor = model.EmployeeFor_Id != null? _context.Employees.First(e => e.Id == model.EmployeeFor_Id) : null,
                EmployeeFrom_Id = model.EmployeeFrom_Id
            };
            _context.Tasks.Add(task);
            _context.SaveChanges();

            return RedirectToAction("GetTasks");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTask(int id, TaskViewModel model)
        {
            model.DoneFile = "";
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Tasks.Any(t => t.TaskId == id))
            {
                return NotFound();
            }
            else if ((model.EmployeeFor_Id != null && !_context.Employees.Any(e => e.Id == model.EmployeeFor_Id)) || !_context.Employees.Any(e => e.Id == model.EmployeeFrom_Id))
            {
                return BadRequest("No employees with such id");
            }

            Models.Task task = new Models.Task
            {
                TaskId = id,
                Header = model.Header,
                Text = model.Text,
                File = model.File,
                DoneFile = model.DoneFile,
                Cover = model.Cover,
                IsDone = model.IsDone,
                UploadDate = DateTime.Now,
                DeadLineDate = model.DeadLineDate,
                Project = _context.Projects.First(p => p.ProjectId == model.ProjectId),
                EmployeeFor = model.EmployeeFor_Id != null ? _context.Employees.First(e => e.Id == model.EmployeeFor_Id) : null,
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFrom_Id),
                EmployeeFrom_Id = model.EmployeeFrom_Id
            };

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("setDone/{id}")]
        public IActionResult setDoneTask(int id, TaskDoneClaimSpecialModel model)
        {
            if (!_context.Tasks.Any(t => t.TaskId == id) || model.doneFilePath == null)
            {
                return NotFound();
            }

            Models.Task task = _context.Tasks.First(t => t.TaskId == id);
            task.IsDone = true;
            task.DoneDate = DateTime.Now;
            task.DoneFile = model.doneFilePath != null ? model.doneFilePath : "";

            _context.Entry(task).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("claim/{id}/{employeeId}")]
        public IActionResult ClaimTask(int id, int employeeId)
        {
            if (!_context.Tasks.Any(t => t.TaskId == id) || !_context.Employees.Any(e => e.Id == employeeId))
            {
                return BadRequest();
            }

            Models.Task task = _context.Tasks.First(t => t.TaskId == id);
            task.EmployeeFor = _context.Employees.First(e => e.Id == employeeId);
            task.EmployeeFor_Id = employeeId;

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

            return Ok();
        }
        [HttpGet]
        [Route("getCompliteTaskInYear")]
        public IEnumerable<int> GetCompliteTaskInYear()
        {
            if (_context.Tasks == null )
            {
                return null;
            }
            List<Models.Task> tasks = _context.Tasks.Where(t=>t.IsDone).Where(t=>t.DoneDate.HasValue&&t.DoneDate.Value.Year==DateTime.Now.Year).OrderBy(t=>t.DoneDate).ToList();
            var results = tasks.GroupBy(t => t.DoneDate.Value.Month).Select(t => new
            {
                Month = t.Key,
                Count = t.Count(),
            });
            int[] monthlyTaskCounts = new int[12];
            foreach (var result in results)
            {
                monthlyTaskCounts[result.Month - 1] = result.Count;
            }
            return monthlyTaskCounts;
        }
    }
   

}
