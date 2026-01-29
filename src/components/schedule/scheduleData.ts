export interface ScheduleItem {
  time: string;
  activity: string;
  type: 'meal' | 'talk' | 'logistics' | 'activity';
  speaker?: string;
}

export interface ScheduleDay {
  dayName: string;
  date: string;
  activities: ScheduleItem[];
}

export const scheduleData: ScheduleDay[] = [
  {
    dayName: "Sábado",
    date: "14 de Janeiro",
    activities: [
      { time: "14:00", activity: "Chegada na Igreja", type: "logistics" },
      { time: "15:00", activity: "Previsão de Saída", type: "logistics" },
      { time: "16:00", activity: "Previsão de Chegada", type: "logistics" },
      { time: "18:00", activity: "Jantar", type: "meal" },
      { time: "19:00", activity: "Palestra 1", type: "talk", speaker: "Rev. Armando" },
      { time: "21:00", activity: "Abertura das Gincanas", type: "activity" },
      { time: "23:00", activity: "Ceia", type: "meal" }
    ]
  },
  {
    dayName: "Domingo",
    date: "15 de Janeiro",
    activities: [
      { time: "07:00", activity: "Despertar", type: "logistics" },
      { time: "07:30", activity: "Café da Manhã", type: "meal" },
      { time: "09:00", activity: "Palestra 2", type: "talk", speaker: "Irmão Aleykson" },
      { time: "12:00", activity: "Almoço", type: "meal" },
      { time: "14:00", activity: "Palestra 3", type: "talk", speaker: "Irmão Aleykson" },
      { time: "15:30", activity: "Lanche da Tarde", type: "meal" },
      { time: "19:00", activity: "Jantar", type: "meal" },
      { time: "20:30", activity: "Atividades em Grupo", type: "activity" },
      { time: "23:30", activity: "Ceia", type: "meal" }
    ]
  },
  {
    dayName: "Segunda",
    date: "16 de Janeiro",
    activities: [
      { time: "07:00", activity: "Despertar", type: "logistics" },
      { time: "07:30", activity: "Café da Manhã", type: "meal" },
      { time: "09:00", activity: "Palavra", type: "talk", speaker: "Rev. Manassés" },
      { time: "12:00", activity: "Almoço", type: "meal" },
      { time: "15:30", activity: "Lanche da Tarde", type: "meal" },
      { time: "18:00", activity: "Palavra", type: "talk", speaker: "Rev. Manassés" },
      { time: "20:00", activity: "Jantar", type: "meal" },
      { time: "21:00", activity: "Atividades em Grupo", type: "activity" },
      { time: "23:30", activity: "Ceia", type: "meal" }
    ]
  },
  {
    dayName: "Terça",
    date: "17 de Janeiro",
    activities: [
      { time: "07:00", activity: "Despertar", type: "logistics" },
      { time: "07:30", activity: "Café da Manhã", type: "meal" },
      { time: "09:00", activity: "Palavra", type: "talk", speaker: "Rev. Manassés" },
      { time: "12:00", activity: "Almoço", type: "meal" },
      { time: "15:00", activity: "Retorno", type: "logistics" }
    ]
  }
];