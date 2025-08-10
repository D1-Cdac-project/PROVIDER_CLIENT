import React, { useState, useEffect } from "react";
import {
  Check,
  XCircle,
  Clock,
  Calendar,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Eye,
  X,
  DollarSign,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { format } from "date-fns";
import { getBookingsByProvider } from "../../services/bookingApi";
import toast from "react-hot-toast";

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortField, setSortField] = useState("startDate");
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getBookingsByProvider();

        const mappedBookings = response.map((booking) => ({
          id: booking._id,
          mandapName: booking.mandapId.mandapName,
          customerName: booking.userId.fullName,
          customerEmail: booking.userId.email,
          startDate: booking.orderDates[0],
          totalAmount: booking.totalAmount,
          status: booking.paymentStatus.toLowerCase(),
          paymentStatus: booking.paymentStatus.toLowerCase(),
          fullBooking: booking,
        }));
        setBookings(mappedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Failed to load bookings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "partial":
        return "bg-warning-50 text-warning-700";
      case "cancelled":
        return "bg-error-50 text-error-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-4 w-4" />;
      case "partial":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success-50 text-success-700";
      case "partial":
        return "bg-warning-50 text-warning-700";
      case "cancelled":
        return "bg-error-50 text-error-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortIcon = (field: string) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch =
        booking.mandapName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());

      if (filter === "all") return matchesSearch;
      if (filter === booking.status) return matchesSearch;

      return false;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case "startDate":
          comparison =
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case "customerName":
          comparison = a.customerName.localeCompare(b.customerName);
          break;
        case "mandapName":
          comparison = a.mandapName.localeCompare(b.mandapName);
          break;
        case "totalAmount":
          comparison = a.totalAmount - b.totalAmount;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking.fullBooking);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // Format address for display
  const formatAddress = (address) => {
    if (!address) return "N/A";
    const { fullAddress, city, state, pinCode } = address;
    return [fullAddress, city, state, pinCode].filter(Boolean).join(", ");
  };

  const totalRevenue = bookings.reduce((sum, booking) => {
    const paid = booking.fullBooking?.amountPaid || 0;
    return sum + paid;
  }, 0);

  const totalPending = bookings.reduce((sum, booking) => {
    const remaining = booking.fullBooking?.remainingAmount || 0;
    return sum + remaining;
  }, 0);

  const totalExpected = bookings.reduce((sum, booking) => {
    const total = booking.fullBooking?.totalAmount || 0;
    return sum + total;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
        <CardContent className="flex items-center p-6">
          <div className="p-4 bg-primary-50 rounded-full mr-4">
            <DollarSign className="h-8 w-8 text-primary-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Amount</p>
            <h3 className="text-2xl font-semibold text-gray-900">
              ₹{totalExpected.toLocaleString()}
            </h3>
          </div>
        </CardContent>
      </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-4 bg-success-50 rounded-full mr-4">
              <DollarSign className="h-8 w-8 text-success-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Received
              </p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ₹{totalRevenue.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-6">
            <div className="p-4 bg-warning-50 rounded-full mr-4">
              <DollarSign className="h-8 w-8 text-warning-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Pending</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ₹{totalPending.toLocaleString()}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              placeholder="Search by mandap, customer name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>

          <div className="w-full md:w-64">
            <Select
              options={[
                { value: "all", label: "All Bookings" },
                { value: "completed", label: "Completed" },
                { value: "partial", label: "Partial" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={filter}
              onChange={setFilter}
              fullWidth
              icon={<Filter className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    No.
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("mandapName")}
                  >
                    <div className="flex items-center">
                      Mandap
                      {sortIcon("mandapName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("customerName")}
                  >
                    <div className="flex items-center">
                      Customer
                      {sortIcon("customerName")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("startDate")}
                  >
                    <div className="flex items-center">
                      Date
                      {sortIcon("startDate")}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort("totalAmount")}
                  >
                    <div className="flex items-center">
                      Amount
                      {sortIcon("totalAmount")}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Payment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-medium">{index + 1}</td>
                    <td className="px-4 py-4">{booking.mandapName}</td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">
                          {booking.customerEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                        <span>
                          {format(new Date(booking.startDate), "dd MMM yyyy")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium">
                      ₹{booking.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">
                          {booking.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                          booking.paymentStatus
                        )}`}
                      >
                        <span className="capitalize">
                          {booking.paymentStatus}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(booking)}
                        icon={<Eye className="h-4 w-4" />}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBookings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filter !== "all"
                    ? "Try a different search or filter"
                    : "Your bookings will appear here"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal for Booking Details */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-lg shadow-xl">
            <CardHeader className="flex justify-between items-center border-b border-gray-200">
              <CardTitle className="text-xl font-semibold text-gray-900">
                Booking Details - #{selectedBooking?._id}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeModal}
                icon={<X className="h-5 w-5 text-gray-500" />}
              />
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Mandap Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedBooking?.mandapId?.mandapName}
                  </p>
                  <p>
                    <strong>Venue Pricing:</strong> ₹
                    {selectedBooking?.mandapId?.venuePricing?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Security Deposit:</strong> ₹
                    {selectedBooking?.mandapId?.securityDeposit?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {formatAddress(selectedBooking?.mandapId?.address)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Customer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Name:</strong> {selectedBooking?.userId?.fullName}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedBooking?.userId?.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedBooking?.userId?.phoneNumber}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {formatAddress(selectedBooking?.userId?.address)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Booking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Order Dates:</strong>{" "}
                    {selectedBooking?.orderDates
                      ?.map((date) => format(new Date(date), "dd MMM yyyy"))
                      .join(", ")}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {selectedBooking?.totalAmount?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Amount Paid:</strong> ₹
                    {selectedBooking?.amountPaid?.toLocaleString()}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {selectedBooking?.paymentStatus}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Caterer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedBooking?.caterer?.map((caterer, index) => (
                    <div key={index}>
                      <p>
                        <strong>Name:</strong> {caterer?.catererName}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {caterer?.menuCategory?.category}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Photographer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedBooking?.photographer?.map((photographer, index) => (
                    <div key={index}>
                      <p>
                        <strong>Name:</strong> {photographer?.photographerName}
                      </p>
                      <p>
                        <strong>Photography Types:</strong>{" "}
                        {photographer?.photographyTypes
                          ?.map(
                            (type) =>
                              `${type?.phtype} (₹${type?.pricePerEvent})`
                          )
                          .join(", ")}
                      </p>
                      <p>
                        <strong>Print Options:</strong>{" "}
                        {photographer?.printOption
                          ?.map(
                            (opt) =>
                              `${opt?.printType} - ${opt?.printDesc} (₹${opt?.printPrice})`
                          )
                          .join(", ")}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Room Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>AC Rooms:</strong>{" "}
                    {selectedBooking?.room?.AcRoom?.noOfRooms} (₹
                    {selectedBooking?.room?.AcRoom?.pricePerNight}/night)
                    {selectedBooking?.room?.AcRoom?.amenities?.length > 0 && (
                      <>
                        <br />
                        <strong>Amenities:</strong>{" "}
                        {selectedBooking?.room?.AcRoom?.amenities?.join(", ")}
                      </>
                    )}
                  </p>
                  <p>
                    <strong>Non-AC Rooms:</strong>{" "}
                    {selectedBooking?.room?.NonAcRoom?.noOfRooms} (₹
                    {selectedBooking?.room?.NonAcRoom?.pricePerNight}/night)
                    {selectedBooking?.room?.NonAcRoom?.amenities?.length > 0 && (
                      <>
                        <br />
                        <strong>Amenities:</strong>{" "}
                        {selectedBooking?.room?.NonAcRoom?.amenities?.join(", ")}
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={closeModal}
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
