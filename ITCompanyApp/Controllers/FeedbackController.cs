using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
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

        [HttpPost]
        public ActionResult<FeedBack> CreateFeedback(FeedBack feedback)
        {
            if (feedback == null)
            {
                return BadRequest();
            }

            _context.FeedBacks.Add(feedback);
            _context.SaveChanges();

            return RedirectToAction("GetFeedbacks");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateFeedback(int id, FeedBack feedBack)
        {
            if (feedBack == null || id != feedBack.FeedBackId)
            {
                return BadRequest();
            }

            _context.Entry(feedBack).State = EntityState.Modified;
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
