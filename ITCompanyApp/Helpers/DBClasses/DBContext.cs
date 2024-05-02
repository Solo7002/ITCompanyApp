using ITCompanyApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Helpers.DBClasses
{
    public class DBContext: DbContext
    {
        public DBContext(DbContextOptions<DBContext> options)
        : base(options) { }
        public virtual DbSet<AccessLevel> AccessLevels { get; set; }
        public virtual DbSet<Department> Departments { get; set; }
        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<Models.Task> Tasks { get; set; }
        public virtual DbSet<FeedBack> FeedBacks { get; set; }
        public virtual DbSet<Job> Jobs { get; set; }
        public virtual DbSet<Project> Projects { get; set; }
        public virtual DbSet<User> Users { get; set; }
        
    }
}
