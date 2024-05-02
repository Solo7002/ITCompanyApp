using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class Project
    {
        public int ProjectId { get; set; }
        public int? EmployeeId { get; set; }
        public virtual Employee EmployeeProjectHead { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string ProjectName { get; set; }
        [StringLength(500, ErrorMessage = "To 500 characters")]
        public string Description { get; set; }
        public string File { get; set; }
        public bool IsDone { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime StartProjectDate { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:dd.MM.yyyy}")]
        public DateTime DeadLineProjectDate { get; set; }
        public virtual ICollection<Task> Tasks { get; set; }
        public virtual ICollection<Employee> Employees { get; set; }
        public Project()
        {
            Tasks = new List<Task>();
            Employees = new List<Employee>();
        }
    }
}
