using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITCompanyApp.Models
{
    public class Department
    {
        public int DepartmentId { get; set; }

        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "From 2 to 50 characters")]
        public string DepartmentName { get; set; }

        [ForeignKey("Employee")]
        public int? DepartmentHeadId { get; set; }
        public virtual Employee Manager { get; set; }
        public virtual ICollection<Employee> Employees { get; set; }
        public Department()
        {
            Employees = new List<Employee>();
        }
    }
}
