using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.SpecialModels.FeedBack;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FeedbackController : ControllerBase
    {
        private readonly DBContext _context;

        public FeedbackController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<FeedBack> GetFeedbacks()
        {
            return _context.FeedBacks.ToList();
        }

        [HttpGet("{id}")]
        public ActionResult<FeedBack> GetFeedback(int id)
        {
            if (!_context.FeedBacks.Any(f => f.FeedBackId == id))
            {
                return NotFound();
            }

            return _context.FeedBacks.First(f => f.FeedBackId == id);
        }

        [HttpGet("EmployeeFor/{id}")]
        public ActionResult<IEnumerable<FeedBackByEmployeeForFrom>> GetFeedbackByEmployeeFor(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            List<FeedBackByEmployeeForFrom> feedbacksForSend = new List<FeedBackByEmployeeForFrom>();

            foreach (FeedBack feedBack in _context.FeedBacks.Where(f => f.EmployeeForId == id))
            {
                Employee employeeFor = _context.Employees.First(e => e.Id ==  feedBack.EmployeeForId);
                Employee employeeFrom = _context.Employees.First(e => e.Id ==  feedBack.EmployeeFromId);

                feedbacksForSend.Add(new FeedBackByEmployeeForFrom
                {
                    FeedBackId = feedBack.FeedBackId,
                    FeedBackText = feedBack.FeedBackText,
                    FeedBackMark = feedBack.FeedBackMark,
                    FeedBackDate = feedBack.FeedBackDate.ToShortDateString(),
                    EmployeeForName = employeeFor.LastName + " " + employeeFor.FirstName,
                    EmployeeFromName = employeeFrom.LastName + " " + employeeFrom.FirstName
                });
            }

            return Ok(feedbacksForSend);
        }

        [HttpGet("EmployeeFrom/{id}")]
        public ActionResult<IEnumerable<FeedBackByEmployeeForFrom>> GetFeedbackByEmployeeFrom(int id)
        {
            if (!_context.Employees.Any(e => e.Id == id))
            {
                return NotFound();
            }

            List<FeedBackByEmployeeForFrom> feedbacksForSend = new List<FeedBackByEmployeeForFrom>();

            foreach (FeedBack feedBack in _context.FeedBacks.Where(f => f.EmployeeFromId == id))
            {
                Employee employeeFor = _context.Employees.First(e => e.Id == feedBack.EmployeeForId);
                Employee employeeFrom = _context.Employees.First(e => e.Id == feedBack.EmployeeFromId);

                feedbacksForSend.Add(new FeedBackByEmployeeForFrom
                {
                    FeedBackId = feedBack.FeedBackId,
                    FeedBackText = feedBack.FeedBackText,
                    FeedBackMark = feedBack.FeedBackMark,
                    FeedBackDate = feedBack.FeedBackDate.ToShortDateString(),
                    EmployeeForName = employeeFor.LastName + " " + employeeFor.FirstName,
                    EmployeeFromName = employeeFrom.LastName + " " + employeeFrom.FirstName
                });
            }

            return Ok(feedbacksForSend);
        }

        [HttpPost]
        public ActionResult<FeedBack> CreateFeedback(FeedbackViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Employees.Any(e => e.Id == model.EmployeeForId) || !_context.Employees.Any(e => e.Id == model.EmployeeFromId))
            {
                return BadRequest("No employees with such id");
            }

            FeedBack feedback = new FeedBack 
            {
                FeedBackText = model.FeedBackText,
                FeedBackMark = model.FeedBackMark,
                FeedBackDate = DateTime.Now,
                EmployeeFor = _context.Employees.First(e => e.Id == model.EmployeeForId),
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFromId),
            };

            _context.FeedBacks.Add(feedback);
            _context.SaveChanges();

            return RedirectToAction("GetFeedbacks");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFeedback(int id, FeedbackViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.FeedBacks.Any(f => f.FeedBackId == id))
            {
                return NotFound();
            }
            else if (!_context.Employees.Any(e => e.Id == model.EmployeeForId) || !_context.Employees.Any(e => e.Id == model.EmployeeFromId))
            {
                return BadRequest("No employees with such id");
            }

            FeedBack feedback = new FeedBack
            {
                FeedBackId = id,
                FeedBackText = model.FeedBackText,
                FeedBackMark = model.FeedBackMark,
                FeedBackDate = DateTime.Now,
                EmployeeFor = _context.Employees.First(e => e.Id == model.EmployeeForId),
                EmployeeFrom = _context.Employees.First(e => e.Id == model.EmployeeFromId),
            };

            _context.Entry(feedback).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetFeedbacks");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteFeedback(int id)
        {
            if (_context.FeedBacks == null || !_context.FeedBacks.Any(f => f.FeedBackId == id))
            {
                return NotFound();
            }
            FeedBack feedback = _context.FeedBacks.First(f => f.FeedBackId == id);

            _context.FeedBacks.Remove(feedback);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }
    }
}
