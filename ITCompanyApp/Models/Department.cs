using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string DepartmentName { get; set; }
        public int? DepartmentHeadId { get; set; }
        public virtual Employee Employee { get; set; }
        public virtual ICollection<Employee> Employees { get; set; }
        public Department()
        {
            Employees = new List<Employee>();
        }
    }
}
