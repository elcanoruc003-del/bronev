'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FaGift, 
  FaArrowLeft, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaUsers,
  FaTicketAlt,
  FaEye,
  FaClock
} from 'react-icons/fa';
import {
  getAdminCampaignDetails,
  approveCampaignParticipation,
  rejectCampaignParticipation,
  getCurrentAdmin,
} from '@/app/actions/admin';
import Link from 'next/link';
import Image from 'next/image';

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const admin = await getCurrentAdmin();
    if (!admin) {
      router.push('/admin');
      return;
    }
    loadCampaign();
  }

  async function loadCampaign() {
    try {
      const result = await getAdminCampaignDetails(campaignId);
      if (result.success && result.data) {
        setCampaign(result.data);
      } else {
        setError(result.error || 'Kampaniya yüklənmədi');
      }
    } catch (error) {
      console.error('Load campaign error:', error);
      setError('Kampaniya yüklənmədi');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(participationId: string) {
    setProcessingId(participationId);
    try {
      const result = await approveCampaignParticipation(participationId);
      if (result.success) {
        loadCampaign();
      } else {
        alert(result.error || 'Təsdiq zamanı xəta');
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('Təsdiq zamanı xəta');
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(participationId: string) {
    const reason = prompt('Rədd səbəbi (istəyə görə):');
    if (reason === null) return; // User cancelled

    setProcessingId(participationId);
    try {
      const result = await rejectCampaignParticipation(participationId, reason || 'Səbəb göstərilməyib');
      if (result.success) {
        loadCampaign();
      } else {
        alert(result.error || 'Rədd zamanı xəta');
      }
    } catch (error) {
      console.error('Reject error:', error);
      alert('Rədd zamanı xəta');
    } finally {
      setProcessingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      PENDING: { label: 'Gözləmədə', class: 'bg-amber-100 text-amber-700', icon: <FaClock /> },
      APPROVED: { label: 'Təsdiqləndi', class: 'bg-green-100 text-green-700', icon: <FaCheckCircle /> },
      REJECTED: { label: 'Rədd edildi', class: 'bg-red-100 text-red-700', icon: <FaTimesCircle /> },
    };
    const badge = statusMap[status] || statusMap.PENDING;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-[#6B5D4F] mb-4">Kampaniya tapılmadı</p>
          <Link
            href="/admin/campaigns"
            className="text-[#8B7355] hover:underline"
          >
            Geri qayıt
          </Link>
        </div>
      </div>
    );
  }

  const pendingCount = campaign.participants?.filter((p: any) => p.status === 'PENDING').length || 0;
  const approvedCount = campaign.participants?.filter((p: any) => p.status === 'APPROVED').length || 0;
  const rejectedCount = campaign.participants?.filter((p: any) => p.status === 'REJECTED').length || 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/campaigns"
            className="w-10 h-10 rounded-xl bg-white hover:bg-gray-100 flex items-center justify-center transition"
          >
            <FaArrowLeft className="text-[#6B5D4F]" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <FaGift className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C2416]">{campaign.title}</h1>
              <p className="text-[#6B5D4F]">Kampaniya detalları və iştirakçılar</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaUsers className="text-2xl text-blue-500" />
              <span className="text-sm text-[#6B5D4F]">Ümumi</span>
            </div>
            <p className="text-3xl font-bold text-[#2C2416]">
              {campaign.participants?.length || 0}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaClock className="text-2xl text-amber-500" />
              <span className="text-sm text-[#6B5D4F]">Gözləmədə</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaCheckCircle className="text-2xl text-green-500" />
              <span className="text-sm text-[#6B5D4F]">Təsdiqləndi</span>
            </div>
            <p className="text-3xl font-bold text-green-600">{approvedCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <FaTimesCircle className="text-2xl text-red-500" />
              <span className="text-sm text-[#6B5D4F]">Rədd edildi</span>
            </div>
            <p className="text-3xl font-bold text-red-600">{rejectedCount}</p>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-[#2C2416] mb-6">
            İştirakçılar ({campaign.participants?.length || 0})
          </h2>

          {!campaign.participants || campaign.participants.length === 0 ? (
            <div className="text-center py-12">
              <FaTicketAlt className="text-6xl text-[#C19A6B] mx-auto mb-4" />
              <p className="text-xl text-[#6B5D4F]">Hələ iştirakçı yoxdur</p>
            </div>
          ) : (
            <div className="space-y-4">
              {campaign.participants.map((participant: any) => (
                <div
                  key={participant.id}
                  className="border-2 border-[#E5DDD5] rounded-xl p-4 hover:border-[#8B7355] transition"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#2C2416]">
                            {participant.participantName}
                          </h3>
                          <p className="text-sm text-[#6B5D4F]">
                            {participant.participantPhone}
                          </p>
                          <p className="text-xs text-[#8B7355] font-mono mt-1">
                            {participant.ticketNumber}
                          </p>
                        </div>
                        {getStatusBadge(participant.status)}
                      </div>

                      <div className="text-xs text-[#6B5D4F] space-y-1">
                        <p>İştirak: {formatDate(participant.submittedAt)}</p>
                        {participant.reviewedAt && (
                          <p>Yoxlanıldı: {formatDate(participant.reviewedAt)}</p>
                        )}
                        {participant.rejectionReason && (
                          <p className="text-red-600">Səbəb: {participant.rejectionReason}</p>
                        )}
                      </div>
                    </div>

                    {/* Receipt Image */}
                    {participant.receiptImage && (
                      <div className="md:w-48">
                        <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-90 transition"
                          onClick={() => setSelectedReceipt(participant.receiptImage)}
                        >
                          <Image
                            src={participant.receiptImage}
                            alt="Receipt"
                            fill
                            sizes="192px"
                            className="object-contain"
                          />
                        </div>
                        <button
                          onClick={() => setSelectedReceipt(participant.receiptImage)}
                          className="w-full mt-2 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm"
                        >
                          <FaEye />
                          <span>Böyüt</span>
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    {participant.status === 'PENDING' && (
                      <div className="flex md:flex-col gap-2">
                        <button
                          onClick={() => handleApprove(participant.id)}
                          disabled={processingId === participant.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                        >
                          {processingId === participant.id ? (
                            <FaSpinner className="animate-spin" />
                          ) : (
                            <>
                              <FaCheckCircle />
                              <span>Təsdiq et</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(participant.id)}
                          disabled={processingId === participant.id}
                          className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                        >
                          <FaTimesCircle />
                          <span>Rədd et</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-4xl w-full h-[80vh] bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center z-10 shadow-lg"
            >
              <FaTimesCircle className="text-gray-700" />
            </button>
            <div className="relative w-full h-full p-4">
              <Image
                src={selectedReceipt}
                alt="Receipt Full Size"
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
