const defaultUserInfo = {
  username: "",
  full_name: "",
  phone: "",
  role: "center",
  center_id: 1,
};

const defaultCenterInfo = {
  name: "InCode academy",
  description: "Robotics for children",
  instagram: "https://instagram.com/incode.academy",
  extra_phones: [{
    "name": "менеджер",
    "phone": "+7 (705) 670-78-92",
    "whatsapp": true,
  }],
  address: [
    {
      city: {name: "Алматы"},
      address: "Наурызбай батыра 50",
      phone: "",
      "2gis": null,
      yandex: "",
    },
    {
      city: "",
      address: "",
      phone: "",
      "2gis": null,
      yandex: "",
    },
  ],
  rating: 0.5, // 0.5 * 100 = 50%, 0.67 * 100 = 67%
}

const defaultWorkSchedule = {
  monday: {start: "09:00", end: "18:00"},
  tuesday: {start: "09:00", end: "18:00"},
  wednesday: {start: "09:00", end: "18:00"},
  thursday: {start: "09:00", end: "18:00"},
  friday: {start: "09:00", end: "18:00"},
  saturday: {start: "09:00", end: "18:00"},
  sunday: null,
}

const defaultSchedule = [
  {
    id: 1,
    innerName: "Математика 1",
    teacher: {full_name: "Феликс"},
    subject: {name: "Математика"},
    schedule: []
  }
]

export const state = () => ({

})

export const getters = {

}

export const mutations = {
  set(state, [namespace, value]) {
    state[namespace] = value;
  }
}

export const actions = {

}
