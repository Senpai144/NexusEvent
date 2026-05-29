// On définit les informations dont le composant a besoin
interface EventCardProps {
  title: string;
  date: string;
  location: string;
  category: string;
}

const EventCard = ({ title, date, location, category }: EventCardProps) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '12px',
      padding: '15px',
      margin: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <span style={{ fontSize: '12px', color: '#007bff', fontWeight: 'bold' }}>{category}</span>
      <h3 style={{ margin: '10px 0' }}>{title}</h3>
      <p style={{ fontSize: '14px', color: '#555' }}>📅 {date}</p>
      <p style={{ fontSize: '14px', color: '#555' }}>📍 {location}</p>
      <button style={{
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Voir les détails
      </button>
    </div>
  );
};

export default EventCard;