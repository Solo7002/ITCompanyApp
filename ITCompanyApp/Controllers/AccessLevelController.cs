using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccessLevelController : ControllerBase
    {
        private readonly DBContext _context;

        public AccessLevelController(DBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<AccessLevel> GetAccessLevels()
        {
            return _context.AccessLevels.ToList();
        }

        [HttpGet("{id}")]
        public AccessLevel GetAccessLevel(int id)
        {
            return _context.AccessLevels.FirstOrDefault(al=>al.AccessLevelId==id);
        }

        [HttpPost]
        public ActionResult<AccessLevel> PostAccessLevel(AccessLevel accessLevel)
        {
            _context.AccessLevels.Add(accessLevel);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }

        [HttpPut("{id}")]
        public IActionResult PutAccessLevel(int id, AccessLevel accessLevel)
        {
            if (id != accessLevel.AccessLevelId)
            {
                return BadRequest();
            }

            _context.Entry(accessLevel).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAccessLevel(int id)
        {
            if (_context.AccessLevels == null)
            {
                return NotFound();
            }
            AccessLevel accessLevel = _context.AccessLevels.FirstOrDefault(al => al.AccessLevelId == id);
            if (accessLevel == null)
            {
                return NotFound();
            }

            _context.AccessLevels.Remove(accessLevel);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }
    }
}
