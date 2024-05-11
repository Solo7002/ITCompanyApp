using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITCompanyApp.Helpers.DBClasses;
using ITCompanyApp.Models;
using Microsoft.AspNetCore.Authorization;
using ITCompanyApp.Models.ViewModels;

namespace ITCompanyApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
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
        public ActionResult<AccessLevel> GetAccessLevel(int id)
        {
            if (!_context.AccessLevels.Any(al => al.AccessLevelId == id))
            {
                return NotFound();
            }
            return _context.AccessLevels.First(al=>al.AccessLevelId==id);
        }

        [HttpPost]
        public ActionResult<AccessLevel> CreateAccessLevel(AccessLevelViewModel model)
        {
            if (model == null || !ModelState.IsValid) 
            {
                return BadRequest();
            }

            AccessLevel accessLevel = new AccessLevel 
            {
                AccessLevelName = model.AccessLevelName,
                AccessLevelMark = model.AccessLevelMark
            };

            _context.AccessLevels.Add(accessLevel);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }

        [HttpPut("{id}")]
        public IActionResult UpdateAccessLevel(int id, AccessLevelViewModel model)
        {
            if (model == null || !ModelState.IsValid)
            {
                return BadRequest();
            }
            else if (!_context.AccessLevels.Any(al => al.AccessLevelId == id))
            {
                return NotFound();
            }

            AccessLevel accessLevel = new AccessLevel
            {
                AccessLevelId = id,
                AccessLevelName = model.AccessLevelName,
                AccessLevelMark = model.AccessLevelMark
            };

            _context.Entry(accessLevel).State = EntityState.Modified;
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteAccessLevel(int id)
        {
            if (_context.AccessLevels == null || !_context.AccessLevels.Any(al=>al.AccessLevelId==id))
            {
                return NotFound();
            }
            AccessLevel accessLevel = _context.AccessLevels.First(al => al.AccessLevelId == id);

            _context.AccessLevels.Remove(accessLevel);
            _context.SaveChanges();

            return RedirectToAction("GetAccessLevels");
        }
    }
}
