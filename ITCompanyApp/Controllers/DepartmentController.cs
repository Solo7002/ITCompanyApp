using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.SpecialModels.Department;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DepartmentController : Controller
    {
        private DBContext _context;
        public DepartmentController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Department> GetDepartments()
        {
            return _context.Departments;
        }
        
        [HttpGet("{id}")]
        public ActionResult<Department> GetDepartment(int id)
        {
            if (!_context.Departments.Any(d => d.DepartmentId == id))
            {
                return NotFound();
            }

            return _context.Departments.First(d => d.DepartmentId == id);
        }

        [HttpGet("getInfo/{id}")]
        public ActionResult<DepartmentInfoModel> GetDepartmentInfo(int id)
        {
            if (!_context.Departments.Any(d => d.DepartmentId == id))
            {
                return NotFound();
            }
            Department dep = _context.Departments.First(d => d.DepartmentId == id);
            Employee DepartmentHead = _context.Employees.First(e => e.Id == dep.DepartmentHeadId);

            DepartmentInfoModel model = new DepartmentInfoModel
            {
                DepartmentId = dep.DepartmentId,
                DepartmentName = dep.DepartmentName,
                DepartmentHeadName = DepartmentHead.LastName + " " + DepartmentHead.FirstName,
                AmountOfWorkers = _context.Employees.Where(e => e.DepartmentId == dep.DepartmentId).Count()
            };

            return Ok(model);
        }

        [HttpGet("checkIfHead/{id}")]
        public ActionResult<Employee> CheckIfHead(int id)
        {
            if (_context.Departments.Any(d => d.DepartmentHeadId == id))
            {
                return Ok(_context.Employees.First(e => e.Id == id));
            }
            return Ok();
        }

        [HttpPost]
        public ActionResult<Department> CreateDepartment(DepartmentViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Employees.Any(e => e.Id == model.DepartmentHeadId))
            {
                return BadRequest("No employees with such id");
            }

            Department department = new Department
            {
                DepartmentName = model.DepartmentName,
                Manager = _context.Employees.First(e => e.Id == model.DepartmentHeadId)
            };

            _context.Departments.Add(department);
            _context.SaveChanges();

            return RedirectToAction("GetDepartments");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDepartment(int id, DepartmentViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Departments.Any(d => d.DepartmentId == id))
            {
                return NotFound();
            }
            else if (!_context.Employees.Any(e => e.Id == model.DepartmentHeadId))
            {
                return BadRequest("No employees with such id");
            }
           
            Department department = _context.Departments.First(d => d.DepartmentId == id);
            
            department.DepartmentName = model.DepartmentName;
            department.Manager = _context.Employees.First(e => e.Id == model.DepartmentHeadId);

            _context.Entry(department).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDepartment(int id)
        {
            if (_context.Departments == null || !_context.Departments.Any(al => al.DepartmentId == id))
            {
                return NotFound();
            }
            Department department = _context.Departments.First(d => d.DepartmentId == id);

            _context.Departments.Remove(department);
            _context.SaveChanges();

            return Ok();
        }

        
    }
}
