import './PhysicianDetails.css';

function PhysicianDetails({ selectedPhysician, profilePicture }) {
  return (
    <div className="physician-detail-card">
      <div className="physician-card-header">
        <div className="physician-meta">
          <h3>{selectedPhysician.name}</h3>
          <p>
            <strong>Specialty:</strong> {selectedPhysician.specialty}
          </p>
          <p>
            <strong>Location:</strong> {selectedPhysician.location}
          </p>
          <p>
            <strong>Phone:</strong> {selectedPhysician.phone}
          </p>
          <p>
            <strong>Education:</strong> {selectedPhysician.education}
          </p>
          <p>
            <strong>Experience:</strong> {selectedPhysician.yearsExperience} years
          </p>
        </div>
        <img
          src={profilePicture}
          alt="Profile"
          className="profile-avatar"
        />
      </div>
      <p className="bio">
        <strong>Bio:</strong> {selectedPhysician.bio}
      </p>
    </div>
  );
}

export default PhysicianDetails;
