// pages/page.tsx

'use client';

import { useState } from 'react';

const FormulaireLivraison = () => {
  const [recipient, setRecipient] = useState({
    name: '',
    address1: '',
    city: '',
    zipCode: '',
    phone: '',
    email: '',
    country: 'FR',
  });
  const [parcelDetails, setParcelDetails] = useState({ weight: 1, service: '961', productCode: '2E' });
  const [label, setLabel] = useState('');

  const handleSubmit = async () => {
    const response = await fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient, parcelDetails }),
    });

    const data = await response.json();

    if (data.success) {
      setLabel(data.label); // Affichez ou téléchargez l'étiquette
    } else {
      console.error(data.message);
    }
  };

  return (
    <div>
      <h1>Formulaire de livraison</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Nom du destinataire</label>
          <input
            className='text-blue-700 border'
            type="text"
            value={recipient.name}
            onChange={(e) => setRecipient({ ...recipient, name: e.target.value })}
          />
        </div>
        <div>
          <label>Adresse 1 du destinataire</label>
          <input
            className='text-blue-700 border'
            type="text"
            value={recipient.address1}
            onChange={(e) => setRecipient({ ...recipient, address1: e.target.value })}
          />
        </div>
        <div>
          <label>Ville du destinataire</label>
          <input
            className='text-blue-700 border'
            type="text"
            value={recipient.city}
            onChange={(e) => setRecipient({ ...recipient, city: e.target.value })}
          />
        </div>
        <div>
          <label>Code postal du destinataire</label>
          <input
            className='text-blue-700 border'
            type="text"
            value={recipient.zipCode}
            onChange={(e) => setRecipient({ ...recipient, zipCode: e.target.value })}
          />
        </div>
        <div>
          <label>Téléphone du destinataire</label>
          <input
            className='text-blue-700 border'
            type="text"
            value={recipient.phone}
            onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })}
          />
        </div>
        <div>
          <label>Email du destinataire</label>
          <input
            className='text-blue-700 border'
            type="email"
            value={recipient.email}
            onChange={(e) => setRecipient({ ...recipient, email: e.target.value })}
          />
        </div>
        {/* Ajoutez un bouton pour soumettre le formulaire */}
        <button onClick={handleSubmit}>Envoyer</button>
      </form>

      {label && (
        <div>
          <h2>Étiquette générée</h2>
          <pre>{label}</pre>
        </div>
      )}
    </div>
  );
};

export default FormulaireLivraison;
