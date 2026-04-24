# 2AI Conference — React + Supabase

Static **React (Vite)** frontend and **Supabase** (Postgres + Edge Functions). Configure and deploy using **`SUPABASE.md`**.

### Payment flow (high level)

```mermaid
flowchart LR
  A["Registration form"] --> B["sessionStorage pendingRegistration"]
  B --> C["Edge: create-payment-order"]
  C --> D["ICICI Eazypay (redirect)"]
  D --> E["/payment-callback page"]
  E --> F["Edge: verify-payment"]
  F --> G["Edge: register"]
  G --> H["/registration-success"]
```

### Local dev

```bash
cp .env.example .env   # add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm install
npm run dev
```
```mermaid
flowchart TD
  subgraph prep["1. Registration (browser)"]
    A[User fills Steps 1–2: details, fees] --> B[Draft saved to localStorage on each change]
    B --> C[User opens Step 3: payment and declaration]
    C --> D{Declaration accepted?}
    D -->|No| E[Stay on form / alert]
    D -->|Yes| F[Click Proceed to payment]
    F --> G[Build payload: form fields + calculated fees]
    G --> H[Write pendingRegistration to sessionStorage]
    H --> I[invokeEdge: create-payment-order]
  end

  subgraph order["2. Create order (Supabase Edge)"]
    I --> J[create-payment-order: ICICI_EAZYPAY_MERCHANT_ID + AES key]
    J --> K[Generate unique orderId e.g. 2AI-ORDER-…]
    K --> L[Build Eazypay GET URL: AES-128-ECB encrypted query params]
    L --> M[Encrypted return URL → FRONTEND_URL/payment-callback]
    M --> O[Return paymentUrl + orderId + redirectMode]
  end

  subgraph redirect["3. Redirect to gateway (browser)"]
    O --> P[startGatewayCheckout stores pendingPaymentOrderId]
    P --> R[window.location.assign → ICICI Eazypay checkout URL]
    R --> S[User leaves your site: lands on ICICI hosted page]
  end

  subgraph pay["4. Pay on ICICI Eazypay"]
    S --> T[User chooses method: card / UPI / netbanking / etc.]
    T --> U{ICICI processes payment}
    U -->|Declined / error| V[Redirect to returnUrl with Response_Code ≠ E000]
    U -->|Success| W[Redirect to returnUrl with Response_Code E000 + bank refs]
  end

  subgraph return["5. Return URL (your SPA)"]
    W --> X[GET /payment-callback?Response_Code=…&Unique_Ref_Number=… etc.]
    V --> Y[GET /payment-callback with failure codes or missing params]
    X --> Z[PaymentCallback page: show Processing payment UI]
    Z --> AA[Read query params from URL]
    AA --> AB[invokeEdge: verify-payment with query + expectedOrderId]
  end

  subgraph verify["6. Verify response (Supabase Edge)"]
    AB --> AC[verify-payment: Response_Code E000 + optional order ref match]
    AC --> AD{Verified?}
    AD -->|No| AE[Return verified: false]
    AD -->|Yes| AF[Return verified: true + transactionId]
    AE --> AG[UI: error state + links to registration / contact]
    AF --> AI[Read pendingRegistration from sessionStorage]
  end

  subgraph reg["7. Complete registration (Supabase Edge)"]
    AI --> AJ{pendingRegistration exists?}
    AJ -->|No| AK[Error: registration data not found]
    AJ -->|Yes| AL[invokeEdge: register with payload + transactionId + paymentVerified]
    AL --> AM[register inserts/updates DB + generates QR / registrationId]
    AM --> AN{register.success?}
    AN -->|No| AO[UI: error after payment]
    AN -->|Yes| AP[Remove pendingRegistration from sessionStorage]
    AP --> AQ[clearRegistrationDraft in localStorage]
    AQ --> AR[Save registrationResult + openTicketAfterSuccess in sessionStorage]
    AR --> AS[Navigate to /registration-success]
  end

  subgraph done["8. Confirmation (browser)"]
    AS --> AT[RegistrationSuccess reads registrationResult]
    AT --> AU[Show confirmation + optional ticket modal]
  end

  Y --> AV[Short-circuit to error UI if params invalid]
  AK --> AG
  AO --> AG
```