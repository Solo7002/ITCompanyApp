using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class User
    {
        [Key]

        [ForeignKey("Employee")]
        public int Id { get; set; }

        [StringLength(30, MinimumLength = 4, ErrorMessage = "From 4 to 30 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Login { get; set; }
        [StringLength(50, MinimumLength = 8, ErrorMessage = "From 8 to 50 characters")]
        [Required(ErrorMessage = "The field must be filled")]
        public string Password { get; set; }
        public int? AccessLevelId { get; set; }
        public virtual AccessLevel AccessLevel { get; set; }
        public virtual Employee Employee { get; set; }

    }
}
