using System.ComponentModel.DataAnnotations;

namespace ITCompanyApp.Models
{
    public class AccessLevel
    {
        public int AccessLevelId { get; set; }
        [Required(ErrorMessage = "The field must be filled")]
        [StringLength(30, MinimumLength = 2, ErrorMessage = "From 2 to 30 characters")]
        public string AccessLevelName { get; set; }
        [Range(1, 10, ErrorMessage = "From 1 to 10")]
        [Required(ErrorMessage = "The field must be filled")]
        public int AccessLevelMark { get; set; }
        public virtual ICollection<User> Users { get; set; }
        public AccessLevel()
        {
            Users = new List<User>();
        }
    }
}
