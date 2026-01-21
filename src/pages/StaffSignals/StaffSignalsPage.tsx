// ============================================================================
// FILE: src/pages/StaffSignals/StaffSignalsPage.tsx
// ============================================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  BarChart3,
  List,
  Grid3X3,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  TrendingUp,
} from "lucide-react";
import { useStaffSignals } from "../../components/hooks/useStaffSignals";
import {
  SignalCard,
  SignalFormModal,
  SignalDetailsModal,
  StatsCard,
} from "../../components/StaffSignals";
import {
  StaffSignalResponse,
  StaffSignalCreateRequest,
  StaffSignalUpdateRequest,
  StaffSignalFilterParams,
  PositionType,
  StaffSignalStatus,
} from "../../types/staffSignals.types";

const StaffSignalsPage: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showStats, setShowStats] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editSignal, setEditSignal] = useState<StaffSignalResponse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filters
  const [filters, setFilters] = useState<StaffSignalFilterParams>({
    active_only: true,
    page: 1,
    page_size: 12,
  });

  // Hook
  const {
    signals,
    selectedSignal,
    stats,
    pagination,
    isLoading,
    isCreating,
    isUpdating,
    error,
    fetchSignals,
    fetchSignalById,
    fetchStats,
    createSignal,
    updateSignal,
    deactivateSignal,
    activateSignal,
    markTpHit,
    markSlHit,
    clearError,
    clearSelectedSignal,
  } = useStaffSignals();

  // Initial load
  useEffect(() => {
    fetchSignals(filters);
    fetchStats(30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handlers
  const handleRefresh = useCallback(() => {
    fetchSignals(filters);
    fetchStats(30);
  }, [fetchSignals, fetchStats, filters]);

  const handleFilterChange = (newFilters: Partial<StaffSignalFilterParams>) => {
    const updatedFilters = { ...filters, ...newFilters, page: 1 };
    setFilters(updatedFilters);
    fetchSignals(updatedFilters);
  };

  const handlePageChange = (page: number) => {
    const updatedFilters = { ...filters, page };
    setFilters(updatedFilters);
    fetchSignals(updatedFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ symbol: searchQuery || undefined });
  };

  const handleCreateSubmit = async (data: StaffSignalCreateRequest) => {
    try {
      console.log("Creating signal with data:", data);
      await createSignal(data);
      console.log("Signal created successfully");
      setShowCreateModal(false);
      setEditSignal(null);
    } catch (err: any) {
      console.error("Error creating signal:", err);
      // Error is already handled by the hook and displayed via the error state
    }
  };

  const handleUpdateSubmit = async (data: StaffSignalCreateRequest) => {
    if (!editSignal) return;
    try {
      // Convert create request to update request (all fields become optional for update)
      const updateData: StaffSignalUpdateRequest = {
        symbol: data.symbol,
        position_type: data.position_type,
        order_type: data.order_type,
        current_price: data.current_price,
        entry_price: data.entry_price,
        stop_loss: data.stop_loss,
        take_profits: data.take_profits,
        leverage: data.leverage,
        notes: data.notes,
        risk_percentage: data.risk_percentage,
      };
      await updateSignal(editSignal.id, updateData);
      setShowCreateModal(false);
      setEditSignal(null);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleEdit = (signal: StaffSignalResponse) => {
    setEditSignal(signal);
    setShowCreateModal(true);
  };

  const handleViewDetails = async (signalId: string) => {
    await fetchSignalById(signalId);
    setShowDetailsModal(true);
  };

  const handleDeactivate = async (signalId: string) => {
    if (window.confirm("Are you sure you want to deactivate this signal?")) {
      await deactivateSignal(signalId);
    }
  };

  const handleActivate = async (signalId: string) => {
    await activateSignal(signalId);
  };

  const handleMarkTpHit = async (signalId: string, tpLevel: number) => {
    const hitPrice = window.prompt("Enter hit price (optional):");
    await markTpHit(signalId, tpLevel, hitPrice ? parseFloat(hitPrice) : undefined);
  };

  const handleMarkSlHit = async (signalId: string) => {
    if (window.confirm("Mark stop loss as hit?")) {
      const notes = window.prompt("Add execution notes (optional):");
      await markSlHit(signalId, notes || undefined);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ active_only: true, page: 1, page_size: 12 });
    fetchSignals({ active_only: true, page: 1, page_size: 12 });
  };

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Staff Signals
            </h1>
            <p className="text-gray-500">
              Create and manage trading signals for users
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 transition-all disabled:opacity-50"
            >
              <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
            </button>

            <button
              onClick={() => setShowStats(!showStats)}
              className={`p-2.5 rounded-lg border transition-all ${
                showStats
                  ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-400"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
              }`}
            >
              <BarChart3 size={18} />
            </button>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all shadow-lg shadow-cyan-500/25"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Create Signal</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
            <button
              onClick={clearError}
              className="p-1 hover:bg-red-500/20 rounded transition-colors"
            >
              <X size={16} className="text-red-400" />
            </button>
          </div>
        )}

        {/* Stats Section */}
        {showStats && (
          <div className="mb-8">
            <StatsCard stats={stats} isLoading={isLoading && !stats} />
          </div>
        )}

        {/* Filters & Search Bar */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by symbol..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </form>

            {/* Filter Toggles */}
            <div className="flex items-center gap-2">
              {/* Position Type Filter */}
              <select
                value={filters.position_type || ""}
                onChange={(e) =>
                  handleFilterChange({
                    position_type: (e.target.value as PositionType) || undefined,
                  })
                }
                className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">All Positions</option>
                <option value="buy">Buy Only</option>
                <option value="sell">Sell Only</option>
              </select>

              {/* Status Filter */}
              <select
                value={filters.status || (filters.active_only ? "active" : "")}
                onChange={(e) => {
                  if (e.target.value === "") {
                    handleFilterChange({ status: undefined, active_only: false });
                  } else {
                    handleFilterChange({
                      status: e.target.value as StaffSignalStatus,
                      active_only: false,
                    });
                  }
                }}
                className="px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="executed">Executed</option>
                <option value="expired">Expired</option>
              </select>

              {/* Clear Filters */}
              {(filters.symbol ||
                filters.position_type ||
                filters.status ||
                !filters.active_only) && (
                <button
                  onClick={clearFilters}
                  className="px-3 py-2.5 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-800 border border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "grid"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <Grid3X3 size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded transition-colors ${
                    viewMode === "list"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Signals Grid/List */}
        {isLoading && signals.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900/80 border border-gray-800 rounded-xl p-5 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg" />
                  <div>
                    <div className="h-5 w-24 bg-gray-800 rounded mb-2" />
                    <div className="h-3 w-16 bg-gray-800 rounded" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-12 bg-gray-800 rounded-lg" />
                  <div className="h-12 bg-gray-800 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : signals.length === 0 ? (
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              No Signals Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.symbol || filters.position_type || filters.status
                ? "Try adjusting your filters"
                : "Create your first trading signal to get started"}
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg text-white font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all"
            >
              <Plus size={18} />
              Create Signal
            </button>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-4"
            }
          >
            {signals.map((signal: StaffSignalResponse) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onEdit={handleEdit}
                onDeactivate={handleDeactivate}
                onActivate={handleActivate}
                onMarkTpHit={handleMarkTpHit}
                onMarkSlHit={handleMarkSlHit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
              of {pagination.total} signals
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                  let pageNum: number;
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        pagination.page === pageNum
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <SignalFormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditSignal(null);
        }}
        onSubmit={editSignal ? handleUpdateSubmit : handleCreateSubmit}
        editSignal={editSignal}
        isLoading={isCreating || isUpdating}
      />

      <SignalDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          clearSelectedSignal();
        }}
        signal={selectedSignal}
        isLoading={isLoading && !selectedSignal}
      />
    </div>
  );
};

export default StaffSignalsPage;