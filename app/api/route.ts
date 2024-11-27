// app/api/route.ts

import { NextResponse } from 'next/server';

const ACCOUNT_NUMBER = '19869502'; // Votre numéro de compte
const PASSWORD = '255562'; // Votre mot de passe

export async function POST(request: Request) {
  const { recipient, parcelDetails } = await request.json();

  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cxf="http://cxf.shipping.soap.chronopost.fr/">
      <soapenv:Header/>
      <soapenv:Body>
        <cxf:shippingMultiParcelV4>
          <headerValue>
            <accountNumber>${ACCOUNT_NUMBER}</accountNumber>
            <idEmit>CHRFR</idEmit>
            <password>${PASSWORD}</password>
          </headerValue>
          <customerValue>
            <customerAdress1>${recipient.address1}</customerAdress1>
            <customerCity>${recipient.city}</customerCity>
            <customerName>${recipient.name}</customerName>
            <customerPhone>${recipient.phone}</customerPhone>
            <customerZipCode>${recipient.zipCode}</customerZipCode>
            <customerEmail>${recipient.email}</customerEmail>
            <customerCountry>${recipient.country}</customerCountry>
          </customerValue>
          <skybillValue>
            <weight>${parcelDetails.weight}</weight>
            <service>${parcelDetails.service}</service>
            <productCode>${parcelDetails.productCode}</productCode>
          </skybillValue>
          <skybillParamsValue>
            <mode>PDF</mode>
          </skybillParamsValue>
        </cxf:shippingMultiParcelV4>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    const response = await fetch('https://ws.chronopost.fr/shipping/services/v1/shippingmultiParcelV4', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
      },
      body: soapRequest,
    });

    const xmlResponse = await response.text();
    // Vous pouvez utiliser une bibliothèque comme `xml2js` pour parser la réponse XML

    return NextResponse.json({ success: true, label: xmlResponse });
  } catch (error) {
    console.error('Error with Chronopost API:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création de l\'étiquette' });
  }
}
