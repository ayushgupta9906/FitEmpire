import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CreditCard,
  BarChart3,
  Calendar,
  Bell,
  Settings as SettingsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LogOut,
  Search as SearchIcon,
  ShieldCheck,
  IndianRupee,
  Wallet,
  FileText,
  Save as SaveIcon,
  Building2,
  Lock as LockIcon,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  Hourglass,
  MoreVertical,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  AlertTriangle,
  ArrowUp,
  User,
  Clock,
  Plus,
  Trash2,
  Upload as UploadIcon,
  MapPin,
  Phone as PhoneIcon,
  Camera,
  AlertCircle,
  QrCode,
  Check,
  RefreshCw,
  Send as SendIcon,
  History as HistoryIcon,
  MessageSquare,
  Sparkles,
  Car,
  Droplets,
  Wifi as WifiIcon,
  Waves,
  Coffee,
  PartyPopper,
  PauseCircle,
  UserPlus,
  Copy,
  ExternalLink
} from 'lucide-react';

const createIcon = (IconComponent: React.ComponentType<any>) => {
  return (props: any) => <IconComponent size={props.fontSize === 'small' ? 16 : props.fontSize === 'large' ? 28 : 20} {...props} />;
};

export const Dashboard = createIcon(LayoutDashboard);
export const People = createIcon(Users);
export const Group = createIcon(Users);
export const Person = createIcon(User);
export const PersonAdd = createIcon(User);
export const FitnessCenter = createIcon(Dumbbell);
export const CardMembership = createIcon(CreditCard);
export const CreditCardIcon = createIcon(CreditCard);
export { CreditCard };
export const Payment = createIcon(CreditCard);
export const BarChart = createIcon(BarChart3);
export const EventNote = createIcon(Calendar);
export const CalendarMonth = createIcon(Calendar);
export const Notifications = createIcon(Bell);
export const NotificationsNone = createIcon(Bell);
export const Settings = createIcon(SettingsIcon);
export const ChevronLeft = createIcon(ChevronLeftIcon);
export const ChevronRight = createIcon(ChevronRightIcon);
export const Logout = createIcon(LogOut);
export const Search = createIcon(SearchIcon);
export const VerifiedUser = createIcon(ShieldCheck);
export const CurrencyRupee = createIcon(IndianRupee);
export const AttachMoney = createIcon(IndianRupee);
export const AccountBalanceWallet = createIcon(Wallet);
export const RequestQuote = createIcon(FileText);
export const Description = createIcon(FileText);
export const Save = createIcon(SaveIcon);
export const AccountBalance = createIcon(Building2);
export const Business = createIcon(Building2);
export const Loyalty = createIcon(StarIcon);
export const Security = createIcon(ShieldCheck);
export const Refresh = createIcon(RefreshCw);
export const Send = createIcon(SendIcon);
export const History = createIcon(HistoryIcon);
export const Message = createIcon(MessageSquare);
export const Email = createIcon(SendIcon);
export const Lock = createIcon(LockIcon);
export const Visibility = createIcon(Eye);
export const VisibilityOff = createIcon(EyeOff);
export const CheckCircle = createIcon(CheckCircle2);
export const Cancel = createIcon(XCircle);
export const Block = createIcon(XCircle);
export const HourglassEmpty = createIcon(Hourglass);
export const MoreVert = createIcon(MoreVertical);
export const TrendingUp = createIcon(TrendingUpIcon);
export const Star = createIcon(StarIcon);
export const Warning = createIcon(AlertTriangle);
export const Error = createIcon(AlertCircle);
export const ArrowUpward = createIcon(ArrowUp);
export const Schedule = createIcon(Clock);
export const AccessTime = createIcon(Clock);
export const Add = createIcon(Plus);
export const Delete = createIcon(Trash2);
export const Upload = createIcon(UploadIcon);
export const LocationOn = createIcon(MapPin);
export const Phone = createIcon(PhoneIcon);
export const PhotoCamera = createIcon(Camera);
export const QrCodeScanner = createIcon(QrCode);
export const Brightness4 = createIcon(Clock);
export const Brightness7 = createIcon(Clock);
export const Menu = createIcon(MoreVertical);
export const AddPhotoAlternate = createIcon(Camera);
export const MapOutlined = createIcon(MapPin);
export const CloudUpload = createIcon(UploadIcon);
export const AcUnit = createIcon(Sparkles);
export const LocalParking = createIcon(Car);
export const Shower = createIcon(Droplets);
export const LockOutlined = createIcon(LockIcon);
export const Wifi = createIcon(WifiIcon);
export const Pool = createIcon(Waves);
export const LocalCafe = createIcon(Coffee);
export const PersonPin = createIcon(MapPin);
export const SportsMma = createIcon(Dumbbell);
export const Celebration = createIcon(PartyPopper);
export const Flare = createIcon(Sparkles);
export const PauseCircleFilled = createIcon(PauseCircle);
export const GroupAdd = createIcon(UserPlus);
export const ContentCopy = createIcon(Copy);
export const OpenInNew = createIcon(ExternalLink);
export const AccountBox = createIcon(User);
