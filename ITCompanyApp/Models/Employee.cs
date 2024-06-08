using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class Employee
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "From 2 to 30 characters")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "From 2 to 30 characters")]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]

        public DateTime BirthDate { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        public string PhoneNumber { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50)]
        [RegularExpression(@"(?<name>[\w.]+)\@(?<domain>\w+\.\w+)(\.\w+)?", ErrorMessage = "Incorrect address")]
        public string Email { get; set; }
        public string PhotoFile { get; set; }
        public double Salary { get; set; }
        public DateTime HireDate { get; set; }
        public DateTime? FireDate { get; set; }
        public int? DepartmentId { get; set; }
        public int? JobId { get; set; }
        public virtual ICollection<FeedBack> FeedBacksFor { get; set; }
        public virtual ICollection<FeedBack> FeedBacksFrom { get; set; }
        public virtual ICollection<Task> TasksFor { get; set; }
        public virtual ICollection<Task> TasksFrom { get; set; }
        public virtual  Job Job { get; set; }
        public virtual  Department Department { get; set; }
        public int? UserId { get; set; }
        public virtual User User { get; set; }
        public virtual ICollection<Project> Projects { get; set; }

        public Employee()
        {
            FeedBacksFor = new List<FeedBack>();
            FeedBacksFrom = new List<FeedBack>();
            TasksFor = new List<Task>();
            TasksFrom = new List<Task>();
            Projects =new List<Project>();
        }
    }
}
