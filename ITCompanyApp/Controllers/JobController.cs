using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using ITCompanyApp.Models.SpecialModels.Department;
using ITCompanyApp.Models.SpecialModels.Jobs;
using ITCompanyApp.Models.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
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

        [HttpGet("getInfo/{id}")]
        public ActionResult<JobInfoModel> GetJobInfo(int id)
        {
            if (!_context.Jobs.Any(j => j.JobId == id))
            {
                return NotFound();
            }
            Job job = _context.Jobs.First(j => j.JobId == id);

            JobInfoModel model = new JobInfoModel
            {
                JobId = job.JobId,
                JobName = job.JobName,
                AmountOfEmployees = _context.Employees.Where(e => e.JobId == id).Count()
            };

            return Ok(model);
        }

        [HttpPost]
        public ActionResult<Job> CreateJob(JobViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }

            Job job = new Job
            { 
                JobName = model.JobName,
            };

            _context.Jobs.Add(job);
            _context.SaveChanges();

            return Ok();
        }

        [HttpPut("{id}")]
        public IActionResult UpdateJob(int id, JobViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.Jobs.Any(j => j.JobId == id))
            {
                return NotFound();
            }

            Job job = new Job
            {
                JobId = id,
                JobName = model.JobName,
            };

            _context.Entry(job).State = EntityState.Modified;
            _context.SaveChanges();

            return Ok();
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

            return Ok();
        }
    }
}
