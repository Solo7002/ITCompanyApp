using ITCompanyApp.Models;
using Microsoft.EntityFrameworkCore;

namespace ITCompanyApp.Helpers.DBClasses
{
    public class DBContext : DbContext
    {
        public DBContext(DbContextOptions<DBContext> options)
        : base(options) { }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Department>()
                .HasOne(d => d.Manager)
                .WithOne()
                .HasForeignKey<Department>(d => d.DepartmentHeadId);

            modelBuilder.Entity<Employee>()
                 .HasMany(e => e.FeedBacksFor)
                 .WithOne(f => f.EmployeeFor)
                 .HasForeignKey(f => f.EmployeeForId);

         



            modelBuilder.Entity<Employee>()
       .HasOne(e => e.Department)
       .WithMany(d => d.Employees)
       .HasForeignKey(e => e.DepartmentId)
       .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Project>()
        .HasOne(p => p.EmployeeProjectHead) 
        .WithMany() 
        .HasForeignKey(p => p.EmployeeId);

            modelBuilder.Entity<Employee>()
            .HasMany(e => e.TasksFor) 
            .WithOne(t => t.EmployeeFor)
            .HasForeignKey(t => t.EmployeeFor_Id);

            base.OnModelCreating(modelBuilder);
        }

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
