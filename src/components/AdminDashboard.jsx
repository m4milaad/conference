import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageLayout from "./PageLayout";
import RegistrationTicket from "./RegistrationTicket";
import { invokeEdge } from "../lib/supabaseFunctions";
import { generateTicketPdfBase64 } from "../lib/ticketPdfGenerator";
import { mapAdminRowToTicketData } from "../lib/ticketData";
import { clearAdminToken, getAdminToken } from "../lib/adminSession";
import { startGatewayCheckout } from "./PaymentGateway";
import {
  Users,
  Settings,
  LogOut,
  TestTube,
  QrCode,
  Edit3,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Database,
  X,
  FileText,
  Mail,
  UserPlus,
  Ticket,
  Copy,
  Plus
} from "lucide-react";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return String(iso);
  }
}

function displayAttendanceMode(row) {
  const mode = row?.attendance_mode ?? row?.attendanceMode ?? "";
  const normalized = String(mode).trim().toLowerCase();
  if (normalized === "online") return "Online";
  if (normalized === "offline") return "Offline";
  return String(mode).trim() || "Offline";
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking");
  const [username, setUsername] = useState("");
  const [regs, setRegs] = useState([]);
  const [regsLoading, setRegsLoading] = useState(false);
  const [regsError, setRegsError] = useState("");
  const [query, setQuery] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [deleteBusyId, setDeleteBusyId] = useState("");
  const [mailBusyId, setMailBusyId] = useState("");
  const [actionMsg, setActionMsg] = useState("");
  const [actionTone, setActionTone] = useState("error");
  const [editForm, setEditForm] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [testPayBusy, setTestPayBusy] = useState(false);
  const [addForm, setAddForm] = useState(null);
  const [addSaving, setAddSaving] = useState(false);

  // Exemption codes state
  const [exemptionCodes, setExemptionCodes] = useState([]);
  const [exemptionLoading, setExemptionLoading] = useState(false);
  const [exemptionGenerateLabel, setExemptionGenerateLabel] = useState("");
  const [exemptionGenerateCount, setExemptionGenerateCount] = useState(1);
  const [exemptionBusy, setExemptionBusy] = useState(false);
  const [exemptionDeleteBusy, setExemptionDeleteBusy] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = getAdminToken();
      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }
      try {
        const result = await invokeEdge("admin-verify", { token });
        if (cancelled) return;
        if (result?.valid) {
          setUsername(result.username || "");
          setStatus("ok");
        } else {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
        }
      } catch {
        if (!cancelled) {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  useEffect(() => {
    if (status !== "ok") return;
    let cancelled = false;
    (async () => {
      const token = getAdminToken();
      if (!token) return;
      setRegsLoading(true);
      setRegsError("");
      try {
        const result = await invokeEdge("admin-registrations", { token });
        if (cancelled) return;
        if (result?.success && Array.isArray(result.registrations)) {
          setRegs(result.registrations);
        } else {
          setRegsError(result?.msg || "Could not load registrations");
        }
      } catch (e) {
        if (!cancelled) setRegsError(e?.message || "Could not load registrations");
      } finally {
        if (!cancelled) setRegsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  // Load exemption codes
  useEffect(() => {
    if (status !== "ok") return;
    let cancelled = false;
    (async () => {
      const token = getAdminToken();
      if (!token) return;
      setExemptionLoading(true);
      try {
        const result = await invokeEdge("admin-exemption-codes", { token, action: "list" });
        if (cancelled) return;
        if (result?.success && Array.isArray(result.codes)) {
          setExemptionCodes(result.codes);
        }
      } catch (e) {
        console.error("Could not load exemption codes", e);
      } finally {
        if (!cancelled) setExemptionLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [status]);

  const stats = useMemo(() => {
    const total = regs.length;
    const paid = regs.filter(r => r.payment_verified).length;
    const pending = total - paid;
    const revenueINR = regs.reduce((acc, r) => acc + (r.payment_verified ? (Number(r.total_fee_inr) || 0) : 0), 0);
    return { total, paid, pending, revenueINR };
  }, [regs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return regs;
    return regs.filter((r) => {
      const blob = [
        r.registration_id,
        r.full_name,
        r.email,
        r.participant_type,
        r.paper_id,
        r.transaction_id,
        r.attendance_mode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [regs, query]);

  const logout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  const openEdit = (r) => {
    setActionMsg("");
    setEditForm({
      registration_id: r.registration_id,
      full_name: r.full_name ?? "",
      email: r.email ?? "",
      affiliation: r.affiliation ?? "",
      designation: r.designation ?? "",
      country: r.country ?? "",
      contact_number: r.contact_number ?? "",
      participant_type: r.participant_type ?? "",
      paper_id: r.paper_id ?? "",
      paper_title: r.paper_title ?? "",
      num_authors:
        r.num_authors != null && r.num_authors !== "" ? String(r.num_authors) : "",
      sub_category: r.sub_category ?? "",
      region: r.region ?? "",
      attendance_mode: displayAttendanceMode(r),
      attend_workshop: r.attend_workshop ?? "",
      total_fee_usd:
        r.total_fee_usd != null && r.total_fee_usd !== "" ? String(r.total_fee_usd) : "",
      total_fee_inr:
        r.total_fee_inr != null && r.total_fee_inr !== "" ? String(r.total_fee_inr) : "",
      mode_of_payment: r.mode_of_payment ?? "",
      transaction_id: r.transaction_id ?? "",
      date_of_payment: r.date_of_payment ? String(r.date_of_payment).slice(0, 10) : "",
      payment_verified: !!r.payment_verified,
    });
  };

  const saveEdit = async () => {
    if (!editForm) return;
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setEditSaving(true);
    try {
      const result = await invokeEdge("admin-update-registration", {
        token,
        registration_id: editForm.registration_id,
        full_name: editForm.full_name,
        email: editForm.email,
        affiliation: editForm.affiliation,
        designation: editForm.designation,
        country: editForm.country,
        contact_number: editForm.contact_number,
        participant_type: editForm.participant_type,
        paper_id: editForm.paper_id,
        paper_title: editForm.paper_title,
        num_authors: editForm.num_authors,
        sub_category: editForm.sub_category,
        region: editForm.region,
        attendance_mode: editForm.attendance_mode,
        attend_workshop: editForm.attend_workshop,
        total_fee_usd: editForm.total_fee_usd,
        total_fee_inr: editForm.total_fee_inr,
        mode_of_payment: editForm.mode_of_payment,
        transaction_id: editForm.transaction_id,
        date_of_payment: editForm.date_of_payment,
        payment_verified: editForm.payment_verified,
      });
      if (result?.success && result.registration) {
        const updated = result.registration;
        setRegs((prev) =>
          prev.map((x) =>
            x.registration_id === updated.registration_id ? { ...x, ...updated } : x,
          ),
        );
        setTicketData((cur) => {
          if (!cur || cur.registrationId !== updated.registration_id) return cur;
          return mapAdminRowToTicketData(updated);
        });
        setEditForm(null);
        setActionTone("success");
        setActionMsg("Registration updated successfully.");
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not save changes");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not save changes");
    } finally {
      setEditSaving(false);
    }
  };

  const openAdd = () => {
    setActionMsg("");
    setAddForm({
      full_name: "",
      email: "",
      affiliation: "",
      designation: "",
      country: "India",
      contact_number: "",
      participant_type: "Delegate",
      paper_id: "",
      paper_title: "",
      num_authors: "",
      sub_category: "",
      region: "",
      attendance_mode: "Offline",
      attend_workshop: "No",
      total_fee_usd: "",
      total_fee_inr: "",
      mode_of_payment: "ICICI Eazypay",
      transaction_id: "",
      date_of_payment: "",
      payment_verified: true,
    });
  };

  const createManualRegistration = async () => {
    if (!addForm) return;
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setAddSaving(true);
    try {
      const result = await invokeEdge("admin-create-registration", {
        token,
        ...addForm,
      });
      if (result?.success && result.registration) {
        setRegs((prev) => [result.registration, ...prev]);
        setAddForm(null);
        setActionTone("success");
        setActionMsg(`Manual registration added: ${result.registration.registration_id}`);
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not create manual registration");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not create manual registration");
    } finally {
      setAddSaving(false);
    }
  };

  const deleteRegistration = async (r) => {
    const ok = window.confirm(
      `Delete registration ${r.registration_id} for ${r.full_name}? This cannot be undone.`,
    );
    if (!ok) return;
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setDeleteBusyId(r.registration_id);
    try {
      const result = await invokeEdge("admin-delete-registration", {
        token,
        registration_id: r.registration_id,
      });
      if (result?.success) {
        setRegs((prev) => prev.filter((x) => x.registration_id !== r.registration_id));
        setTicketData((cur) => (cur?.registrationId === r.registration_id ? null : cur));
        setActionTone("success");
        setActionMsg("Registration deleted.");
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not delete registration");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not delete registration");
    } finally {
      setDeleteBusyId("");
    }
  };

  const startOneRupeeTestPayment = async () => {
    setActionMsg("");
    setActionTone("error");
    setTestPayBusy(true);
    try {
      const stamp = Date.now();
      const testRegistrationData = {
        fullName: "Milad Ajaz Bhat",
        affiliation: "2AI Admin QA",
        designation: "QA Engineer",
        country: "India",
        email: `mb4milad.bhattt@gmail.com`,
        contactNumber: "8899108592",
        participantType: "Test",
        paperId: `TEST-${String(stamp).slice(-6)}`,
        paperTitle: "Admin Payment Flow Test",
        numAuthors: "1",
        subCategory: "Test",
        region: "South Asian",
        attendWorkshop: "No",
        totalFeeUsd: "0",
        totalFeeInr: "1",
        modeOfPayment: "ICICI Eazypay",
        declaration: true,
      };

      sessionStorage.setItem("pendingRegistration", JSON.stringify(testRegistrationData));
      await startGatewayCheckout({
        amount: 1,
        currency: "INR",
        registrationData: testRegistrationData,
      });
    } catch (e) {
      setActionMsg(e?.message || "Could not start ₹1 test payment");
      setTestPayBusy(false);
    }
  };

  const sendManualTicketEmail = async (r) => {
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setMailBusyId(r.registration_id);
    try {
      const ticketData = mapAdminRowToTicketData(r);
      const pdfBase64 = await generateTicketPdfBase64(ticketData);
      const result = await invokeEdge("admin-send-registration-email", {
        token,
        registration_id: r.registration_id,
        pdf_base64: pdfBase64,
      });
      if (result?.success) {
        setActionTone("success");
        setActionMsg(result?.msg || "Email sent.");
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not send email");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not send email");
    } finally {
      setMailBusyId("");
    }
  };

  const generateExemptionCodes = async () => {
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setExemptionBusy(true);
    try {
      const result = await invokeEdge("admin-exemption-codes", {
        token,
        action: "generate",
        label: exemptionGenerateLabel.trim(),
        count: exemptionGenerateCount,
      });
      if (result?.success && Array.isArray(result.codes)) {
        setExemptionCodes((prev) => [...result.codes, ...prev]);
        setExemptionGenerateLabel("");
        setExemptionGenerateCount(1);
        setActionTone("success");
        setActionMsg(`Generated ${result.codes.length} exemption code(s).`);
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not generate codes");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not generate codes");
    } finally {
      setExemptionBusy(false);
    }
  };

  const deleteExemptionCode = async (code) => {
    const ok = window.confirm(`Delete exemption code ${code}? This cannot be undone.`);
    if (!ok) return;
    setActionMsg("");
    setActionTone("error");
    const token = getAdminToken();
    if (!token) return;
    setExemptionDeleteBusy(code);
    try {
      const result = await invokeEdge("admin-exemption-codes", {
        token,
        action: "delete",
        code,
      });
      if (result?.success) {
        setExemptionCodes((prev) => prev.filter((c) => c.code !== code));
        setActionTone("success");
        setActionMsg("Exemption code deleted.");
      } else {
        setActionTone("error");
        setActionMsg(result?.msg || "Could not delete code");
      }
    } catch (e) {
      setActionTone("error");
      setActionMsg(e?.message || "Could not delete code");
    } finally {
      setExemptionDeleteBusy("");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setActionTone("success");
      setActionMsg(`Copied: ${text}`);
    }).catch(() => {
      setActionTone("error");
      setActionMsg("Failed to copy");
    });
  };

  if (status === "checking") {
    return (
      <PageLayout title="Admin" subtitle="">
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Database size={48} className="text-[#5E6AD2] animate-pulse" />
          <p className="text-zinc-500 font-medium">Verifying secure session…</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Admin Dashboard" subtitle="Manage conference registrations and payments">
      {ticketData && (
        <RegistrationTicket registrationData={ticketData} onClose={() => setTicketData(null)} />
      )}

      {/* Add Modal */}
      {addForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            onClick={() => !addSaving && setAddForm(null)}
          />
          <div className="relative linear-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl animate-zoomFadeIn">
            <div className="px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between bg-[var(--surface-soft)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                  <UserPlus size={20} className="text-[var(--brand)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Add Registration Manually</h2>
                  <p className="text-xs text-[var(--text-soft)]">Create a paid/pending record without payment gateway callback.</p>
                </div>
              </div>
              <button
                type="button"
                disabled={addSaving}
                onClick={() => setAddForm(null)}
                className="p-2 rounded-lg hover:bg-[var(--surface-muted)] transition-colors"
              >
                <X size={20} className="text-[var(--text-soft)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Full Name *</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.full_name} onChange={(e) => setAddForm((f) => ({ ...f, full_name: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Email *</span>
                  <input type="email" className="mt-1.5 w-full linear-input" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Affiliation *</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.affiliation} onChange={(e) => setAddForm((f) => ({ ...f, affiliation: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Designation</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.designation} onChange={(e) => setAddForm((f) => ({ ...f, designation: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Country</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.country} onChange={(e) => setAddForm((f) => ({ ...f, country: e.target.value }))} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Contact Number</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.contact_number} onChange={(e) => setAddForm((f) => ({ ...f, contact_number: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Participant Type</span>
                  <select className="mt-1.5 w-full linear-input" value={addForm.participant_type} onChange={(e) => setAddForm((f) => ({ ...f, participant_type: e.target.value }))}>
                    <option value="Author">Author</option>
                    <option value="Non-Author">Non-Author</option>
                    <option value="Delegate">Delegate</option>
                    <option value="Test">Test</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Attendance Mode</span>
                  <select className="mt-1.5 w-full linear-input" value={addForm.attendance_mode} onChange={(e) => setAddForm((f) => ({ ...f, attendance_mode: e.target.value }))}>
                    <option value="Offline">Offline</option>
                    <option value="Online">Online</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Paper ID</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.paper_id} onChange={(e) => setAddForm((f) => ({ ...f, paper_id: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Number of Authors</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.num_authors} onChange={(e) => setAddForm((f) => ({ ...f, num_authors: e.target.value }))} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Paper Title</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.paper_title} onChange={(e) => setAddForm((f) => ({ ...f, paper_title: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Sub-Category</span>
                  <select className="mt-1.5 w-full linear-input" value={addForm.sub_category} onChange={(e) => setAddForm((f) => ({ ...f, sub_category: e.target.value }))}>
                    <option value="">Select sub-category</option>
                    <option value="UG / PG / PhD Student">UG / PG / PhD Student</option>
                    <option value="Others">Others</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Region</span>
                  <select className="mt-1.5 w-full linear-input" value={addForm.region} onChange={(e) => setAddForm((f) => ({ ...f, region: e.target.value }))}>
                    <option value="">Select region</option>
                    <option value="South Asian">South Asian</option>
                    <option value="Other Countries">Other Countries</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Workshop</span>
                  <select className="mt-1.5 w-full linear-input" value={addForm.attend_workshop} onChange={(e) => setAddForm((f) => ({ ...f, attend_workshop: e.target.value }))}>
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Mode of Payment</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.mode_of_payment} onChange={(e) => setAddForm((f) => ({ ...f, mode_of_payment: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Fee (USD)</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.total_fee_usd} onChange={(e) => setAddForm((f) => ({ ...f, total_fee_usd: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Fee (INR)</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.total_fee_inr} onChange={(e) => setAddForm((f) => ({ ...f, total_fee_inr: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Transaction ID</span>
                  <input className="mt-1.5 w-full linear-input" value={addForm.transaction_id} onChange={(e) => setAddForm((f) => ({ ...f, transaction_id: e.target.value }))} />
                </label>
                <label className="block">
                  <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Date of Payment</span>
                  <input type="date" className="mt-1.5 w-full linear-input" value={addForm.date_of_payment} onChange={(e) => setAddForm((f) => ({ ...f, date_of_payment: e.target.value }))} />
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)]/50 cursor-pointer sm:col-span-2 transition-all hover:bg-[var(--surface-soft)]">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-zinc-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                    checked={addForm.payment_verified}
                    onChange={(e) => setAddForm((f) => ({ ...f, payment_verified: e.target.checked }))}
                  />
                  <div>
                    <span className="block text-sm font-bold text-[var(--text-main)]">Payment Verified</span>
                    <span className="text-xs text-[var(--text-soft)]">Mark this record as paid.</span>
                  </div>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-soft)] flex justify-end gap-3 bg-[var(--surface-soft)]/50">
              <button
                type="button"
                disabled={addSaving}
                onClick={() => setAddForm(null)}
                className="px-4 py-2 text-sm font-bold text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={addSaving}
                onClick={createManualRegistration}
                className="linear-primary px-6 py-2 text-sm"
              >
                {addSaving ? "Creating…" : "Create Registration"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editForm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            onClick={() => !editSaving && setEditForm(null)}
          />
          <div className="relative linear-card w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0 border-0 shadow-2xl animate-zoomFadeIn">
            <div className="px-6 py-4 border-b border-[var(--border-soft)] flex items-center justify-between bg-[var(--surface-soft)]/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[var(--brand)]/10 flex items-center justify-center">
                  <Edit3 size={20} className="text-[var(--brand)]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[var(--text-main)]">Edit Registration</h2>
                  <p className="text-xs text-[var(--text-soft)] font-mono">{editForm.registration_id}</p>
                </div>
              </div>
              <button
                type="button"
                disabled={editSaving}
                onClick={() => setEditForm(null)}
                className="p-2 rounded-lg hover:bg-[var(--surface-muted)] transition-colors"
              >
                <X size={20} className="text-[var(--text-soft)]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-4 sm:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-soft)]">Basic Information</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Full Name</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.full_name}
                        onChange={(e) => setEditForm((f) => ({ ...f, full_name: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Email Address</span>
                      <input
                        type="email"
                        className="mt-1.5 w-full linear-input"
                        value={editForm.email}
                        onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-t border-black/[0.05] dark:border-white/5 pt-4">Professional Details</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Affiliation</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.affiliation}
                        onChange={(e) => setEditForm((f) => ({ ...f, affiliation: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Designation</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.designation}
                        onChange={(e) => setEditForm((f) => ({ ...f, designation: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Country</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.country}
                        onChange={(e) => setEditForm((f) => ({ ...f, country: e.target.value }))}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Contact Number</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.contact_number}
                        onChange={(e) => setEditForm((f) => ({ ...f, contact_number: e.target.value }))}
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 border-t border-black/[0.05] dark:border-white/5 pt-4">Conference Options</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Participant Type</span>
                      <select
                        className="mt-1.5 w-full linear-input"
                        value={editForm.participant_type}
                        onChange={(e) => setEditForm((f) => ({ ...f, participant_type: e.target.value }))}
                      >
                        <option value="">Select type</option>
                        <option value="Author">Author</option>
                        <option value="Non-Author">Non-Author</option>
                        <option value="Delegate">Delegate</option>
                        <option value="Test">Test</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Attendance Mode</span>
                      <select
                        className="mt-1.5 w-full linear-input"
                        value={editForm.attendance_mode}
                        onChange={(e) => setEditForm((f) => ({ ...f, attendance_mode: e.target.value }))}
                      >
                        <option value="">Select mode</option>
                        <option value="Offline">Offline</option>
                        <option value="Online">Online</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Paper ID</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.paper_id}
                        onChange={(e) => setEditForm((f) => ({ ...f, paper_id: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Number of Authors</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.num_authors}
                        onChange={(e) => setEditForm((f) => ({ ...f, num_authors: e.target.value }))}
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Paper Title</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.paper_title}
                        onChange={(e) => setEditForm((f) => ({ ...f, paper_title: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Sub-Category</span>
                      <select
                        className="mt-1.5 w-full linear-input"
                        value={editForm.sub_category}
                        onChange={(e) => setEditForm((f) => ({ ...f, sub_category: e.target.value }))}
                      >
                        <option value="">Select sub-category</option>
                        <option value="UG / PG / PhD Student">UG / PG / PhD Student</option>
                        <option value="Others">Others</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 ml-1">Region</span>
                      <select
                        className="mt-1.5 w-full linear-input"
                        value={editForm.region}
                        onChange={(e) => setEditForm((f) => ({ ...f, region: e.target.value }))}
                      >
                        <option value="">Select region</option>
                        <option value="South Asian">South Asian</option>
                        <option value="Other Countries">Other Countries</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Workshop</span>
                      <select
                        className="mt-1.5 w-full linear-input"
                        value={editForm.attend_workshop}
                        onChange={(e) => setEditForm((f) => ({ ...f, attend_workshop: e.target.value }))}
                      >
                        <option value="">Select workshop option</option>
                        <option value="No">No</option>
                        <option value="Yes">Yes</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-soft)] border-t border-[var(--border-soft)] pt-4">Payment & Verification</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Fee (USD)</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.total_fee_usd}
                        onChange={(e) => setEditForm((f) => ({ ...f, total_fee_usd: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Fee (INR)</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.total_fee_inr}
                        onChange={(e) => setEditForm((f) => ({ ...f, total_fee_inr: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Mode of Payment</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.mode_of_payment}
                        onChange={(e) => setEditForm((f) => ({ ...f, mode_of_payment: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Transaction ID</span>
                      <input
                        className="mt-1.5 w-full linear-input"
                        value={editForm.transaction_id}
                        onChange={(e) => setEditForm((f) => ({ ...f, transaction_id: e.target.value }))}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Date of Payment</span>
                      <input
                        type="date"
                        className="mt-1.5 w-full linear-input"
                        value={editForm.date_of_payment}
                        onChange={(e) => setEditForm((f) => ({ ...f, date_of_payment: e.target.value }))}
                      />
                    </label>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)]/50 cursor-pointer sm:col-span-2 transition-all hover:bg-[var(--surface-soft)]">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-zinc-300 text-[var(--brand)] focus:ring-[var(--brand)]"
                        checked={editForm.payment_verified}
                        onChange={(e) => setEditForm((f) => ({ ...f, payment_verified: e.target.checked }))}
                      />
                      <div>
                        <span className="block text-sm font-bold text-[var(--text-main)]">Payment Verified</span>
                        <span className="text-xs text-[var(--text-soft)]">Manually confirm this registration is paid</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[var(--border-soft)] flex justify-end gap-3 bg-[var(--surface-soft)]/50">
              <button
                type="button"
                disabled={editSaving}
                onClick={() => setEditForm(null)}
                className="px-4 py-2 text-sm font-bold text-[var(--text-soft)] hover:text-[var(--text-main)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={editSaving}
                onClick={saveEdit}
                className="linear-primary px-6 py-2 text-sm"
              >
                {editSaving ? "Saving Changes…" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="space-y-6">
        {/* Header Actions & Stats */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="linear-card p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[var(--text-soft)] mb-2">
                <Users size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Total</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-main)]">{stats.total}</p>
            </div>
            <div className="linear-card p-4 flex flex-col justify-between border-l-4 border-green-500">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <CheckCircle size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Paid</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-main)]">{stats.paid}</p>
            </div>
            <div className="linear-card p-4 flex flex-col justify-between border-l-4 border-amber-500">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Clock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
              </div>
              <p className="text-2xl font-bold text-[var(--text-main)]">{stats.pending}</p>
            </div>
            <div className="linear-card p-4 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-[var(--brand)] mb-2">
                <Database size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Revenue</span>
              </div>
              <p className="text-lg font-bold text-[var(--text-main)] truncate">₹{stats.revenueINR.toLocaleString()}</p>
            </div>
          </div>

          <div className="linear-card p-4 flex flex-col justify-center gap-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--surface-soft)] flex items-center justify-center">
                  <Settings size={14} className="text-[var(--text-soft)]" />
                </div>
                <span className="text-xs font-bold text-[var(--text-main)]">{username || "Admin"}</span>
              </div>
              <button
                onClick={logout}
                className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
              >
                <LogOut size={14} /> Log out
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={testPayBusy}
                onClick={startOneRupeeTestPayment}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[11px] font-bold hover:bg-emerald-100 transition-colors disabled:opacity-50"
              >
                <TestTube size={14} /> Test ₹1
              </button>
              <Link
                to="/verify-ticket"
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#5E6AD2]/20 bg-[#5E6AD2]/5 text-[#5E6AD2] text-[11px] font-bold hover:bg-[#5E6AD2]/10 transition-colors"
              >
                <QrCode size={14} /> Verify QR
              </Link>
              <button
                type="button"
                onClick={openAdd}
                className="col-span-2 flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-violet-200 bg-violet-50 text-violet-700 text-[11px] font-bold hover:bg-violet-100 transition-colors"
              >
                <UserPlus size={14} /> Add Manual Registration
              </button>
            </div>
          </div>
        </div>

        {/* Exemption Codes Section */}
        <div className="linear-card overflow-hidden p-0">
          <div className="px-6 py-5 border-b border-[var(--border-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-amber-500/5">
            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <Ticket size={20} className="text-amber-600" />
              Late Fee Exemption Codes
              <span className="text-xs font-normal text-amber-700 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {exemptionCodes.length}
              </span>
            </h3>
          </div>

          <div className="px-6 py-4 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/30">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <label className="flex-1 block">
                <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Label (optional)</span>
                <input
                  type="text"
                  placeholder="e.g. Speaker X, Sponsor Y"
                  className="mt-1 w-full linear-input"
                  value={exemptionGenerateLabel}
                  onChange={(e) => setExemptionGenerateLabel(e.target.value)}
                />
              </label>
              <label className="w-24 block">
                <span className="text-xs font-bold text-[var(--text-soft)] ml-1">Count</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  className="mt-1 w-full linear-input"
                  value={exemptionGenerateCount}
                  onChange={(e) => setExemptionGenerateCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                />
              </label>
              <button
                type="button"
                disabled={exemptionBusy}
                onClick={generateExemptionCodes}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold shadow-sm transition-colors disabled:opacity-50"
              >
                <Plus size={16} />
                {exemptionBusy ? "Generating…" : "Generate"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-500/10 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Label</th>
                  <th className="px-6 py-3">Created By</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Used By</th>
                  <th className="px-6 py-3">Created</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] dark:divide-white/5">
                {exemptionLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Ticket className="text-amber-500 animate-pulse" size={28} />
                        <p className="text-sm text-zinc-500">Loading codes…</p>
                      </div>
                    </td>
                  </tr>
                ) : exemptionCodes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 italic text-sm">
                      No exemption codes yet. Generate one above.
                    </td>
                  </tr>
                ) : (
                  exemptionCodes.map((c) => (
                    <tr key={c.code} className="group hover:bg-[var(--surface-soft)] transition-colors">
                      <td className="px-6 py-3">
                        <span className="font-mono text-sm font-bold text-[var(--text-main)] tracking-wider">
                          {c.code}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-[var(--text-soft)]">{c.label || "—"}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs font-medium text-[var(--text-soft)]">{c.created_by || "—"}</span>
                      </td>
                      <td className="px-6 py-3">
                        {c.used_by_registration_id ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-500/10 text-zinc-600 text-[10px] font-bold w-fit">
                            <CheckCircle size={10} /> Used
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                            <Clock size={10} /> Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        {c.used_by_registration_id ? (() => {
                          const linkedReg =
                            c.used_by_registration ||
                            regs.find((r) => r.registration_id === c.used_by_registration_id) ||
                            null;
                          const linkedName = linkedReg?.full_name || "Unknown participant";
                          const linkedEmail = linkedReg?.email || "";
                          return (
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                onClick={() => setQuery(c.used_by_registration_id)}
                                className="text-[10px] font-mono text-[var(--brand)] hover:underline text-left cursor-pointer"
                                title="Click to filter registrations table"
                              >
                                {c.used_by_registration_id}
                              </button>
                              <span className="text-[11px] font-semibold text-[var(--text-main)]">
                                {linkedName}
                              </span>
                              {linkedEmail && (
                                <span className="text-[10px] text-[var(--text-soft)]">
                                  {linkedEmail}
                                </span>
                              )}
                              {c.used_at && (
                                <span className="text-[10px] text-[var(--text-soft)]">
                                  on {formatDate(c.used_at)}
                                </span>
                              )}
                            </div>
                          );
                        })() : (
                          <span className="text-xs text-[var(--text-soft)]">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-xs text-[var(--text-soft)]">{formatDate(c.created_at)}</span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Copy Code"
                            onClick={() => copyToClipboard(c.code)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-amber-600 hover:bg-amber-500/10 transition-all"
                          >
                            <Copy size={16} />
                          </button>
                          <button
                            title="Delete Code"
                            disabled={exemptionDeleteBusy === c.code}
                            onClick={() => deleteExemptionCode(c.code)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Search & Table Area */}
        <div className="linear-card overflow-hidden p-0">
          <div className="px-6 py-5 border-b border-[var(--border-soft)] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[var(--brand)]/5">
            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              Registrations
              <span className="text-xs font-normal text-[var(--brand)] bg-[var(--brand)]/10 px-2 py-0.5 rounded-full">
                {filtered.length}
              </span>
            </h3>
            <div className="w-full md:w-96">
              <input
                type="text"
                placeholder="Search registrations..."
                className="w-full px-4 py-2 linear-input bg-[var(--surface)]/80 border-[var(--brand)]/20 text-sm focus:ring-2 focus:ring-[var(--brand)]/10 transition-all placeholder:text-[var(--text-soft)]/50"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {(regsError || actionMsg) && (
            <div
              className={`px-6 py-3 border-b flex items-center gap-2 text-sm ${
                !regsError && actionTone === "success"
                  ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400"
              }`}
            >
              <AlertCircle size={16} />
              {regsError || actionMsg}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[var(--brand)]/10 text-[11px] font-bold uppercase tracking-wider text-[var(--brand)]">
                  <th className="px-6 py-4">Participant</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Registration Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.05] dark:divide-white/5">
                {regsLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Database className="text-[#5E6AD2] animate-spin" size={32} />
                        <p className="text-sm text-zinc-500">Fetching registrations...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500 italic text-sm">
                      No registrations found matching your search.
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.registration_id} className="group hover:bg-[var(--surface-soft)] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--text-main)]">{r.full_name}</span>
                          <span className="text-xs text-[var(--text-soft)] truncate max-w-[180px]">{r.email}</span>
                          <span className="text-[10px] font-mono text-[var(--brand)] mt-1">{r.registration_id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-[var(--surface-soft)] text-[10px] font-bold text-[var(--text-muted)]">
                              {r.participant_type || "Participant"}
                            </span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-[10px] font-bold text-blue-600">
                              {displayAttendanceMode(r)}
                            </span>
                          </div>
                          {r.paper_id && (
                            <span className="text-[11px] text-[var(--text-soft)] flex items-center gap-1">
                              <FileText size={10} /> {r.paper_id}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[var(--text-main)]">₹{(Number(r.total_fee_inr) || 0).toLocaleString()}</span>
                          <span className="text-[10px] text-[var(--text-soft)]">${Number(r.total_fee_usd) || 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {r.payment_verified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-700 text-[10px] font-bold">
                            <CheckCircle size={10} /> Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-[var(--text-soft)]">{formatDate(r.created_at)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            title="Edit"
                            onClick={() => openEdit(r)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-[#5E6AD2] hover:bg-[#5E6AD2]/10 transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            title="View Ticket"
                            onClick={() => setTicketData(mapAdminRowToTicketData(r))}
                            className="p-2 rounded-lg text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Send Mail"
                            disabled={mailBusyId === r.registration_id}
                            onClick={() => sendManualTicketEmail(r)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-sky-500 hover:bg-sky-500/10 transition-all disabled:opacity-30"
                          >
                            <Mail size={16} />
                          </button>
                          <button
                            title="Delete"
                            disabled={deleteBusyId === r.registration_id}
                            onClick={() => deleteRegistration(r)}
                            className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all disabled:opacity-30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
