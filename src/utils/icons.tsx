import {
  FaCar,
  FaHome,
  FaMobileAlt,
  FaTshirt,
  FaChair,
  FaBriefcase,
  FaTools,
  FaDog,
  FaEye,
  FaSearch,
  FaPlus,
  FaUser,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa'

export const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  car: FaCar,
  home: FaHome,
  mobile: FaMobileAlt,
  clothing: FaTshirt,
  furniture: FaChair,
  briefcase: FaBriefcase,
  tools: FaTools,
  dog: FaDog,
  eye: FaEye,
  search: FaSearch,
  plus: FaPlus,
  user: FaUser,
  phone: FaPhone,
  envelope: FaEnvelope,
}

export function getIcon(iconName: string) {
  return iconMap[iconName] || FaHome
}

