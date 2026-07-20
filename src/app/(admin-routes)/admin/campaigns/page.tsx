'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGift, FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaClock, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import {
  getAdminCampaigns,
  deleteCampaign,
  getCurrentAdmin,
} from '@/app/actions/admin';
import Link from 'next/link';

export default function AdminCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const admin = await getCurrentAdmin();
    if (!admin) {
      router.push('/admin');
      return;
    }
    loadCampaigns();
  }

  async function loadCampaigns() {
    try {
      const result = await getAdminCampaigns();
      if (result.success && result.data) {
        setCampaigns(result.data);
      } else {
        setError(result.error || 'Kampaniyalar yüklənmədi');
      }
    } catch (error) {
      console.error('Load campaigns error:', error);
      setError('Kampaniyalar yüklənmədi');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(campaignId: string, title: string) {
    if (!confirm(`"${title}" kampaniyasını silmək istədiyinizdən əminsiniz?`)) {
      return;
    }

    try {
      const result = await deleteCampaign(campaignId);
      if (result.success) {
        loadCampaigns();
      } else {
        alert(result.error || 'Silinmə zamanı xəta baş verdi');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Silinmə zamanı xəta baş verdi');
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      ACTIVE: { label: 'Aktiv', class: 'bg-green-100 text-green-700' },
      DRAFT: { label: 'Qaralama', class: 'bg-gray-100 text-gray-700' },
      ENDED: { label: 'Bitib', class: 'bg-blue-100 text-blue-700' },
      CANCELLED: { label: 'Ləğv edilib', class: 'bg-red-100 text-red-700' },
    };
    const badge = statusMap[status] || statusMap.DRAFT;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-[#8B7355]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <FaGift className="text-2xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#2C2416]">Kampaniyalar</h1>
              <p className="text-[#6B5D4F]">Kampaniya və iştirakçı idarəetməsi</p>
            </div>
          </div>

          <Link
            href="/admin/campaigns/new"
            className="flex items-center gap-2 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold"
          >
            <FaPlus />
            <span>Yeni Kampaniya</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <FaGift className="text-6xl text-[#C19A6B] mx-auto mb-4" />
            <p className="text-xl text-[#6B5D4F] mb-4">Hələ kampaniya yoxdur</p>
            <Link
              href="/admin/campaigns/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#8B7355] to-[#C19A6B] text-white px-6 py-3 rounded-xl hover:shadow-lg transition font-semibold"
            >
              <FaPlus />
              <span>İlk Kampaniyanı Yarat</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition overflow-hidden"
              >
                {/* Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-[#2C2416] line-clamp-2 flex-1">
                      {campaign.title}
                    </h3>
                    {getStatusBadge(campaign.status)}
                  </div>
                  <p className="text-sm text-[#6B5D4F] line-clamp-2">
                    {campaign.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="p-6 bg-gray-50 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-[#8B7355]" />
                    <div>
                      <p className="text-xs text-[#6B5D4F]">İştirakçılar</p>
                      <p className="text-lg font-bold text-[#2C2416]">
                        {campaign._count?.participants || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaGift className="text-[#8B7355]" />
                    <div>
                      <p className="text-xs text-[#6B5D4F]">İştirak haqqı</p>
                      <p className="text-lg font-bold text-[#2C2416]">
                        {campaign.participationFee / 100} ₼
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                  <Link
                    href={`/admin/campaigns/${campaign.id}`}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition font-semibold"
                  >
                    <FaEye />
                    <span>Bax</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(campaign.id, campaign.title)}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
