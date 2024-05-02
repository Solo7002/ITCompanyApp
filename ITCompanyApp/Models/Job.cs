using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class Job
    {
        public int JobId { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string JobName { get; set; }
        public virtual ICollection<Employee> Employee { get; set; }
        public Job()
        {
            Employee = new List<Employee>();
        }

    }
}
