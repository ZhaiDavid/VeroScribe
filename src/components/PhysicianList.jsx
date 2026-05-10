import './PhysicianList.css';

function PhysicianList({
  physicians,
  selectedPhysicianId,
  setSelectedPhysicianId,
  setSelectedSlotId,
  setMessage
}) {
  return (
    <div className="card-list">
      {physicians.map((physician) => (
        <button
          key={physician.id}
          className={`card ${physician.id === selectedPhysicianId ? 'selected' : ''}`}
          onClick={() => {
            setSelectedPhysicianId(physician.id);
            setSelectedSlotId('');
            setMessage('');
          }}
          type="button"
        >
          <strong>{physician.name}</strong>
          <span>{physician.specialty}</span>
          <small>{physician.location}</small>
        </button>
      ))}
    </div>
  );
}

export default PhysicianList;
