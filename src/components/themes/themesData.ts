export interface Theme {
  title: string;
  subtitle: string;
  reference: string;
  color: string;
}

export const themesData: Theme[] = [
  {
    title: "PALESTRA 1",
    subtitle: "Glorificando a Deus nos relacionamentos com os irmãos na fé",
    reference: "Cl 3:12-17",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "PALESTRA 2", 
    subtitle: "Glorificando a Deus nas relações familiares",
    reference: "Cl 3:18-22",
    color: "from-green-500 to-emerald-500"
  },
  {
    title: "PALESTRA 3",
    subtitle: "Glorificando a Deus na relação com os descrentes", 
    reference: "Cl 4:5-6",
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "PALESTRA 4",
    subtitle: "Glorificando a Deus no namoro",
    reference: "1 Ts 4:1-7", 
    color: "from-orange-500 to-red-500"
  },
  {
    title: "PALESTRA 5",
    subtitle: "Glorificando a Deus no acolhimento",
    reference: "Rm 15:1-7",
    color: "from-indigo-500 to-blue-500"
  },
  {
    title: "PALESTRA 6",
    subtitle: "Glorificando a Deus por meio do evangelismo pessoal",
    reference: "Jo 4:1-30, 39-43",
    color: "from-yellow-500 to-orange-500"
  }
];