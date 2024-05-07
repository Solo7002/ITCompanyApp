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
        public FeedBack GetFeedback(int id)
        {
            return _context.FeedBacks.FirstOrDefault(f => f.FeedBackId == id);
        }

        [HttpPost]
        public ActionResult<FeedBack> PostFeedback(FeedBack feedback)
        {
            _context.FeedBacks.Add(feedback);
            _context.SaveChanges();

            return RedirectToAction("GetFeedbacks");
        }

        [HttpPut("{id}")]
        public IActionResult PutFeedback(int id, FeedBack feedBack)
        {
            if (id != feedBack.FeedBackId)
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
            if (_context.FeedBacks == null)
            {
                return NotFound();
            }
            FeedBack feedback = _context.FeedBacks.FirstOrDefault(f => f.FeedBackId == id);
            if (feedback == null)
            {
                return NotFound();
            }

            _context.FeedBacks.Remove(feedback);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }
    }
}
