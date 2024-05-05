using ITCompanyApp.Models;
using Task = ITCompanyApp.Models.Task;

namespace ITCompanyApp.Helpers.DBClasses
{
    public class DBInitialization
    {
        public static void SeedData(DBContext context)
        {
            Job job = new Job
            {
                JobName = "ASP.NET Dev"
            };
            context.Jobs.Add(job);
            AccessLevel accessLevel = new AccessLevel
            {
                AccessLevelName = "Admin",
                AccessLevelMark = 10
            };
            context.AccessLevels.Add(accessLevel);
           

            User user = new User
            {
                Login = "Login",
                Password = "Password",
                AccessLevel = accessLevel
            };

            Employee employee = new Employee
            {
                FirstName = "Bob",
                LastName = "Jane",
                BirthDate = new DateTime(2000, 10, 10),
                PhoneNumber = "1234567890",
                Email = "dkgsdk@gmail.com",
                Salary = 2000,
                HireDate = new DateTime(2015, 11, 11),
                Job = job,
            };

            
            employee.User = user;
           
            user.Employee = employee;
            
            Department department = new Department
            {

                DepartmentName = "Developers",
                Manager = employee,
            };
          
      
            context.Employees.Add(employee);
            context.Users.Add(user);
            context.Departments.Add(department);

            Project project = new Project
            {
                ProjectName = "PHP Server",
                EmployeeProjectHead = employee,
                Description = "Description",
                IsDone = false,
                StartProjectDate = new DateTime(2000, 11, 11),
                DeadLineProjectDate = new DateTime(2005, 5, 5),
            };
            context.Projects.Add(project);
            Task task = new Models.Task
            {
                Header = "Dev php artisan",
                Project = project,
                EmployeeFor = employee,
                EmployeeFrom = employee,
                UploadDate = new DateTime(2000, 10, 10),
                DeadLineDate = new DateTime(2001, 10, 10),
                IsDone = false
            };
            context.Tasks.Add(task);

            FeedBack feedBack = new FeedBack
            {
                FeedBackText = "It`s good worker",
                FeedBackDate = new DateTime(2000, 11, 11),
                FeedBackMark = 5,
                EmployeeFrom = employee,
                EmployeeFor = employee
            };

            context.FeedBacks.Add(feedBack);

            context.SaveChanges();
        }
    }
}
