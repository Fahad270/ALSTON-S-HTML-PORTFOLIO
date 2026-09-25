export const MOCK_INSPECTIONS = [
  {
    id: 'INSP-101',
    businessName: 'Demo Manufacturing Pvt Ltd',
    department: 'Fire & Emergency Services',
    type: 'Fire NOC Initial Inspection',
    address: 'Plot No. 42, MIDC Industrial Area, Mumbai',
    status: 'Pending',
    date: 'Today, 2:00 PM',
    lat: 19.1234,
    lng: 72.8345,
    checklist: [
      { id: 'c1', task: 'Verify presence of fire extinguishers', checked: false },
      { id: 'c2', task: 'Check emergency exit paths', checked: false },
      { id: 'c3', task: 'Review structural blueprint', checked: false },
    ],
    evidences: []
  },
  {
    id: 'INSP-102',
    businessName: 'EcoTech Solutions',
    department: 'Pollution Control Board',
    type: 'Consent to Establish',
    address: 'Sector 5, Airoli, Navi Mumbai',
    status: 'Pending',
    date: 'Today, 4:30 PM',
    lat: 19.1456,
    lng: 72.9987,
    checklist: [
      { id: 'c1', task: 'Check wastewater treatment plant', checked: false },
      { id: 'c2', task: 'Measure decibel levels', checked: false },
    ],
    evidences: []
  },
  {
    id: 'INSP-103',
    businessName: 'Sunrise Foods',
    department: 'FSSAI / Health',
    type: 'Hygiene Verification',
    address: 'Andheri East, Mumbai',
    status: 'Completed',
    date: 'Yesterday',
    lat: 19.1136,
    lng: 72.8697,
    checklist: [
      { id: 'c1', task: 'Kitchen hygiene check', checked: true },
      { id: 'c2', task: 'Storage temperature check', checked: true },
    ],
    evidences: [{ uri: 'https://via.placeholder.com/150', lat: 19.1136, lng: 72.8697 }]
  }
];
