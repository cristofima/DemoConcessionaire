namespace Concessionaire.WebAPI.Entities
{
    public partial class Car
    {
        public int Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int Year { get; set; }
        public string ImagePath { get; set; }
        public string TechnicalDataSheetPath { get; set; }
    }
}
