using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class JobController : Controller
    {
        private DBContext _context;
        public JobController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Job> Get()
        {
            return _context.Jobs;
        }

        [HttpGet("{id}")]
        public Job Get(int id)
        {
            return _context.Jobs.FirstOrDefault(j => j.JobId == id);
        }

        [HttpPost]
        public ActionResult<Job> PostJob(Job job)
        {
            _context.Jobs.Add(job);
            _context.SaveChanges();

            return RedirectToAction("Get");
        }

        [HttpPut("{id}")]
        public IActionResult PutJob(int id, Job job)
        {
            if (id != job.JobId)
            {
                return BadRequest();
            }

            _context.Entry(job).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("Get");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteJob(int id)
        {
            if (_context.Jobs == null)
            {
                return NotFound();
            }
            Job job = _context.Jobs.FirstOrDefault(j => j.JobId == id);
            if (job == null)
            {
                return NotFound();
            }

            _context.Jobs.Remove(job);
            _context.SaveChanges();

            return RedirectToAction("Get");
        }
    }
}
