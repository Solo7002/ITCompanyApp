using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Mvc;

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
    }
}
