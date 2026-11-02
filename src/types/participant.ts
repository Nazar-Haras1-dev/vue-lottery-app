export interface Participant {
  id: string
  name: string
  dob: string // формат yyyy-mm-dd
  email: string
  phone: string
}

export type ParticipantInput = Omit<Participant, 'id'>
