using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class JobController : Controller
    {
        private DBContext _context;
        public JobController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Job> GetJobs()
        {
            return _context.Jobs;
        }

        [HttpGet("{id}")]
        public ActionResult<Job> GetJob(int id)
        {
            if (!_context.Jobs.Any(j => j.JobId == id))
            {
                return NotFound();
            }

            return _context.Jobs.First(j => j.JobId == id);
        }

        [HttpPost]
        public ActionResult<Job> CreateJob(Job job)
        {
            if (job == null)
            {
                return BadRequest();
            }

            _context.Jobs.Add(job);
            _context.SaveChanges();

            return RedirectToAction("GetJobs");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJob(int id, Job job)
        {
            if (job == null || id != job.JobId)
            {
                return BadRequest();
            }

            _context.Entry(job).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetJobs");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJob(int id)
        {
            if (_context.Jobs == null || !_context.Jobs.Any(j => j.JobId == id))
            {
                return NotFound();
            }
            Job job = _context.Jobs.First(j => j.JobId == id);

            _context.Jobs.Remove(job);
            _context.SaveChanges();

            return RedirectToAction("GetJobs");
        }
    }
}
