using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Task = ITCompanyApp.Models.Task;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : Controller
    {
        private DBContext _context;
        public EmployeeController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Employee> GetEmployees()
        {
            return _context.Employees;
        }

        [HttpGet("{id}")]
        public ActionResult<Employee> GetEmployee(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            return _context.Employees.First(e => e.Id == id);
        }

        [HttpGet("byDepartmentId/{id}")]
        public ActionResult<IEnumerable<Employee>> GetEmployeesByDepartmentId(int id)
        {
            if (!_context.Departments.Any(d => d.DepartmentId == id))
            {
                return NotFound();
            }

            return Ok(_context.Employees.Where(e => e.DepartmentId == id));
        }

        [HttpGet("byJobId/{id}")]
        public ActionResult<IEnumerable<Employee>> GetEmployeesByJobId(int id)
        {
            if (!_context.Jobs.Any(j => j.JobId == id))
            {
                return NotFound();
            }

            return Ok(_context.Employees.Where(e => e.JobId == id));
        }

        [HttpPut("{id}")]
        public IActionResult UpdateEmployee(int id, EmployeeViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest("ModelState");
            }
            else if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else if (!_context.Departments.Any(d => d.DepartmentId == model.DepartmentId))
            {
                return BadRequest("No departments with such id");
            }
            else if (!_context.Jobs.Any(j => j.JobId == model.JobId))
            {
                return BadRequest("No jobs with such id");
            }

            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.LastName = model.LastName;
            employee.FirstName = model.FirstName;
            employee.BirthDate = model.BirthDate;
            employee.PhoneNumber = model.PhoneNumber;
            employee.Email = model.Email;
            employee.HireDate = DateTime.Now;
            employee.PhotoFile = model.PhotoFile;
            employee.Salary = model.Salary;
            employee.Department = _context.Departments.First(d => d.DepartmentId == model.DepartmentId);
            employee.Job = _context.Jobs.First(j => j.JobId == model.JobId);

            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            User user = _context.Users.First(u => u.Id == employee.Id);

            _context.Employees.Remove(employee);
            _context.Users.Remove(user);
            _context.SaveChanges();

            return RedirectToAction("GetEmployees");
        }
        [HttpPost]
        [Route("fire/{id}")]
        public IActionResult FireEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.FireDate = DateTime.Now;
            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();
            return RedirectToAction("GetEmployees");
        }
        [HttpPost]
        [Route("appoint/{id}")]
        public IActionResult AppointEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            employee.FireDate = null;
            _context.Entry(employee).State = EntityState.Modified;
            _context.SaveChanges();
            return RedirectToAction("GetEmployees");
        }
        [HttpGet]
        [Route("lastProjects/{id}")]
        public ActionResult< IEnumerable<ProjectViewModel>> GetLastThreeProjectsByEmployeeId(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return BadRequest();
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
           List<Models.Task> task = _context.Tasks.Where(t => t.EmployeeFor_Id == employee.Id).ToList();
            List<ProjectViewModel> projects = new List<ProjectViewModel>();
            foreach (Models.Task item in task)
            {
                Project project = _context.Projects.First(e => e.ProjectId == item.ProjectId);
                projects.Add(new ProjectViewModel
                {
                    File = project.File,
                    DeadLineProjectDate = project.DeadLineProjectDate,
                    Description = project.Description,
                    EmployeeId = project.EmployeeId,
                    IsDone=project.IsDone,
                    ProjectName = project.ProjectName,
                    StartProjectDate=project.StartProjectDate,

                }); ;
            }

            projects = projects.OrderBy(p => p.StartProjectDate).Distinct().Take(3).ToList();
            return Ok(projects);

        }
        [HttpGet]
        [Route("getCountTasks/{id}")]
        public IEnumerable<int> GetCountTaskInMonth(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return null;
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            List<Task> tasks = _context.Tasks
    .Where(t => t.EmployeeFor_Id == employee.Id
                && t.IsDone
                && t.DoneDate.HasValue
                && t.DoneDate.Value.Year == DateTime.Now.Year)
    .OrderBy(t => t.DoneDate)
    .ToList();
            var completedTasksByMonth = tasks
                .GroupBy(t => t.DoneDate.Value.Month)
                .Select(g => new
                {
                    Month = g.Key,
                    Count = g.Count()
                })
                .ToList();

            int[] monthlyTaskCounts = new int[12];
            foreach (var result in completedTasksByMonth)
            {
                monthlyTaskCounts[result.Month - 1] = result.Count;
            }
            return monthlyTaskCounts;

        }

        [HttpGet]
        [Route("getAvarageFeedback/{id}")]
        public double GetAvarageFeedbackScoreById(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return 0;
            }

            Employee employee = _context.Employees.First(e => e.Id == id);

            if (employee == null)
            {
                return 0;
            }
            var feedbacks = _context.FeedBacks.Where(f => f.EmployeeForId == employee.Id).ToList();
            if (!feedbacks.Any())
            {
                return 0;
            }
            List<FeedBack> feedBacks = _context.FeedBacks.Where(f => f.EmployeeForId == employee.Id).ToList();
            double avarageFeedback = Math.Round(feedBacks.Average(f => f.FeedBackMark), 2);
            return avarageFeedback;


        }
        [HttpGet]
        [Route("getEmployeeNameAndFeedback/{id}")]
        public List<object> GetEmployeeNameAndFeedbackById(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return null;
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            var employeesByDepartment = _context.Employees
             .Where(e => e.DepartmentId == employee.DepartmentId)
             .ToList();

            var result = employeesByDepartment.Where(e=>e.FireDate==null)
            .Select(e => new
            {
                Id = e.Id,
                Name = $"{e.LastName} {e.FirstName}",
                AverageFeedback = GetAvarageFeedbackScoreById(e.Id),
                JobId = e.JobId
            }).OrderByDescending(e=>e.AverageFeedback)
            .ToList();

            return result.Cast<object>().ToList();
        }
        [HttpGet]
        [Route("getAllEmployeesNameAndFeedBack")]
        public List<object> GetAllEmployeeNameAndFeedBack()
        { 
            if(_context.Employees==null)
                return null;
            List<Employee> employees=_context.Employees.Where(e => e.FireDate == null).ToList();
            var results = employees.Select(e=>new{
                Id=e.Id,
                Name = $"{e.LastName} {e.FirstName}",
                AverageFeedback = GetAvarageFeedbackScoreById(e.Id),
                JobId = e.JobId
            }).OrderByDescending(e => e.AverageFeedback)
         .ToList();
            return results.Cast<object>().ToList();
        }
        [HttpGet]
        [Route("getBirthdayIsComingEmployees")]
        public List<object> GetBirthdayIsComingEmployees()
        {
            if (_context.Employees == null)
                return null;
            List<Employee> employees = _context.Employees.Where(e=>e.FireDate==null)
                .Where(e =>
                (e.BirthDate.Month == DateTime.Now.Month && e.BirthDate.Day >= DateTime.Now.Day) ||
                (e.BirthDate.Month > DateTime.Now.Month))
                .OrderBy(e=>e.BirthDate.Month).ThenBy(e=>e.BirthDate.Day).Take(4).ToList();
            var results = employees.Select(e => new
            {
                Id = e.Id,
                Name = $"{e.LastName} {e.FirstName}",
                Birthdate = $"{e.BirthDate.ToString("dd.MM")}"
            });
            return results.Cast<object>().ToList();
        }
        [HttpGet]
        [Route("getInfoTasks/{id}")]
        public object GetInfoTasksByIdEmployee(int id)
        {
            if (_context.Employees == null || !_context.Employees.Any(e => e.Id == id))
            {
                return null;
            }
            Employee employee = _context.Employees.First(e => e.Id == id);
            List<Task> tasks=_context.Tasks.Where(t=>t.EmployeeFor_Id== employee.Id).ToList();
            var result = new
            {
                DoneTask = tasks.Where(t => t.IsDone).Count(),
                AllTask = tasks.Count,
                UnDoneTask=tasks.Where(t=>!t.IsDone).Count(),
            };
            return result;
             
        }
        [HttpGet]
        [Route("getCountEmployees")]
        public object GetCountAllEmployees()
        {
            if (_context.Employees == null)
            {
                return null;
            }
            List<Employee> employees = _context.Employees.ToList();
            var result = new
            {
                AllEmployee=employees.Count,
                FireEmployee=employees.Where(e=>e.FireDate!=null).Count(),
                NotFireEmployee=employees.Where(e=>e.FireDate==null).Count(),
            };
            return result;
        }
        [HttpGet]
        [Route("getNewEmployees")]
        public IEnumerable<int> GetNewEmployeesInYear()
        {
            if (_context.Employees == null)
            {
                return null;
            }
            List<Employee> employees = _context.Employees.Where(e => e.HireDate.Year == DateTime.Now.Year)
            .OrderBy(e => e.HireDate)
            .ToList();
            var results = employees.GroupBy(e => e.HireDate.Month).Select(e => new
            {
                Month = e.Key,
                Count = e.Count()
            });
            int[] monthlyNewEmployeeCounts = new int[12];
            foreach (var result in results)
            {
                monthlyNewEmployeeCounts[result.Month - 1] = result.Count;
            }
            return monthlyNewEmployeeCounts;
        }
        [HttpGet]
        [Route("getFireEmployeesInYear")]
        public IEnumerable<int> GetFireEmployeesInYear()
        {
            if (_context.Employees == null)
            {
                return null;
            }
            List<Employee> employees = _context.Employees.Where(e => e.FireDate.HasValue&& e.FireDate.Value.Year == DateTime.Now.Year)
            .OrderBy(e => e.FireDate)
            .ToList();
            var results = employees.GroupBy(e => e.FireDate.Value.Month).Select(e => new
            {
                Month = e.Key,
                Count = e.Count()
            });
            int[] monthlyEmployeeCounts = new int[12];
            foreach (var result in results)
            {
                monthlyEmployeeCounts[result.Month - 1] = result.Count;
            }
            return monthlyEmployeeCounts;
        }
        [HttpGet]
        [Route("getMonthlyExpensesInYear")]
        public IEnumerable<double> GetFireEmployeesSalaryInYear()
        {
            if (_context.Employees == null)
            {
                return null;
            }

            List<Employee> employees = _context.Employees.ToList();
            List<double> salaryInYear = new List<double>();

            for (int i = 1; i <= 12; i++)
            {
                double totalSalary = 0;
                if (i > DateTime.Now.Month)
                {
                    salaryInYear.Add(totalSalary);
                }
                else
                {
                    foreach (var employee in employees)
                    {
                        if (employee.HireDate < DateTime.Now)
                        {
                            if (employee.FireDate.HasValue && employee.FireDate.Value.Month < i)
                            {
                                totalSalary += employee.Salary;
                            }
                            else if (!employee.FireDate.HasValue&&employee.HireDate.Month<=i)
                            {
                                totalSalary += employee.Salary;
                            }
                        }
                    }

                    salaryInYear.Add(totalSalary);
                }
            }

            return salaryInYear;
        }

        [HttpGet]
        [Route("getAvarageSalary")]
        public double GetAvarageSalary()
        {
            if (_context.Employees == null)
            {
                return 0;
            }
            double salary=Math.Round(_context.Employees.Where(e=>e.FireDate==null).Average(e=>e.Salary),2);
            return salary;
        }





    }
}
