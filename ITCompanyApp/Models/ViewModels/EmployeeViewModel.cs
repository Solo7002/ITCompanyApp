using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models.ViewModels
{
    public class EmployeeViewModel
    {
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
        public int? DepartmentId { get; set; }
        public int? JobId { get; set; }
        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            var other = (EmployeeViewModel)obj;
            return LastName == other.LastName &&
                   FirstName == other.FirstName &&
                   BirthDate == other.BirthDate &&
                   PhoneNumber == other.PhoneNumber &&
                   Email == other.Email &&
                   PhotoFile == other.PhotoFile &&
                   Salary == other.Salary &&
                   DepartmentId == other.DepartmentId &&
                   JobId == other.JobId;
        }

        public override int GetHashCode()
        {
            return HashCode.Combine(this.LastName, this.FirstName, this.BirthDate, this.PhoneNumber, this.Email, this.PhotoFile, this.Salary);
        }


    }
}
