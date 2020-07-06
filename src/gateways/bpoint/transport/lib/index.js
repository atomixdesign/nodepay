/**
 * 
 */
module.exports = BPOINT;

function BPOINT() {
    function Sender(req, callback, errorCallback, creds, proxy) {
        var unirest = require("unirest");
        var userAgent = req.userAgent();
        var auth;
        
        switch (req.method()) {
        case "POST":
            this.request = unirest.post(req.baseUrl() + req.url())
                .type("json").send(req.payload());
            break;
        case "GET":
            this.request = unirest.get(req.baseUrl() + req.url());
            break;
        case "PUT":
            this.request = unirest.put(req.baseUrl() + req.url())
                .type("json").send(req.payload());
            break;
        case "DELETE":
            this.request = unirest.delete(req.baseUrl() + req.url());
            break;
        }
        auth = (Buffer.from(creds.Username + "|" + creds.MerchantNumber + ":" + creds.Password)).toString("base64");
        
        this.request.header("Content-Type", "application/json; charset=utf-8")
            .header("Authorization", auth)
            .header("user-agent", userAgent)
            .timeout(req.timeout())
            .proxy(proxy)
            .end(function (response) {
                if (200 === response.code) {
                    callback(response.body);
                } else if (errorCallback !== undefined) {
                    if (true == response.serverError) {
                        errorCallback(response.code, response.raw_body);
                    } else {
                        errorCallback(response.error);
                    }
                }
                
            });
    }
    
    function populate(source, dest) {
        if (undefined !== source && undefined !== dest) {
            for (var prop in dest) {
                if (dest.hasOwnProperty(prop)) {
                    if (source.hasOwnProperty(prop)) {
                        dest[prop] = source[prop];
                    } else if (0 !== prop.indexOf("_")) {
                        delete dest[prop];
                    }
                }
            }
        } 
        
        return;
    }
    
    function _stripPrivate(req) {
        var ret = {};
        
        for (var prop in req) {
            if (0 !== prop.indexOf("_")) {
                ret[prop] = req[prop];
            }
        }
        
        return ret;
    }
    
    function Request() {
        this._BaseUrl = undefined;
        this._url = undefined;
        this._method = undefined;
        this._UserAgent = "BPOINT:1039:3:3.0.0.0|NODEJS";
        this._Timeout = 100000;
        this._credentials = {};
    }
    
    Request.prototype.payload = function() {
        return null;
    };
    
    Request.prototype.credentials = function(args) {
        if (undefined !== args) {
            this._credentials.Username = args.Username;
            this._credentials.Password = args.Password;
            this._credentials.MerchantNumber = args.MerchantNumber;
        }
        
        return this._credentials;
    }
    
    Request.prototype.baseUrl = function(_base) {
        var retval;
        
        if (undefined !== _base) {
            this._BaseUrl = _base;
        }
        
        if (undefined === this._BaseUrl) {
            retval = "Base URL not set!";
        } else {
            retval = this._BaseUrl;
        }
        
        return retval;
    };
    
    Request.prototype.userAgent = function(_agent) {
        
        if (undefined !== _agent) {
            this._UserAgent = _agent;
        }
        
        return this._UserAgent;
    };
    
    Request.prototype.timeout = function(_timeout) {
        
        if (undefined !== _timeout) {
            this._Timeout = _timeout;
        }
        
        return this._Timeout;
    };
    
    Request.prototype.url = function() {
        return this._url;
    };
    
    Request.prototype.method = function() {
        return this._method;
    };
    
    Request.prototype.submit = function(callback, errorCallback, creds, proxy) {
        var s = new Sender(this, callback, errorCallback, creds, proxy);
    };
    
    function TxnRequest(args) {
        this.Action = null;
        this.Amount = 0;
        this.AmountOriginal = 0;
        this.AmountSurcharge = 0;
        this.CardDetails = null;
        this.Currency = null;
        this.Customer = null;
        this.MerchantReference = null;
        this.Order = null;
        this.OriginalTxnNumber = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.BillerCode = null;
        this.TestMode = false;
        this.StoreCard = false;
        this.SubType = null;
        this.Type = null;
        this.TokenisationMode = 0;
        this.FraudScreeningRequest = null;
        this.StatementDescriptor = null;
        this._method = "POST";
        this._url = "/txns/";
        
        populate(args, this);
    }
    
    TxnRequest.prototype = new Request();
    
    TxnRequest.prototype.payload = function() {
        return { TxnReq : _stripPrivate(this) };
    };
    
    function TxnRequestWithAuthKey(args)
    {
        this.Amount = null;
        this.AmountOriginal = null;
        this.AmountSurcharge = null;
        this.CardDetails = null;
        this.Currency = null;
        this.EmailAddress = null;
        this.MerchantReference = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.BillerCode = null;
        this.StoreCard = false;
        this.FraudScreeningDeviceFingerprint = null;
        
        populate(args, this);
    }
    
    TxnRequestWithAuthKey.prototype = new Request();
    
    TxnRequestWithAuthKey.prototype.payload = function() {
        return { TxnReq : _stripPrivate(this) };
    };
    
    function TxnFetch(txnNo) {
        this._url = "/txns/" + txnNo;
        this._method = "GET";
    }
    
    TxnFetch.prototype = new Request();
    
    function TxnSearch(args) {
        this.Action = null;
        this.Amount = 0;
        this.AuthoriseId = null;
        this.BankResponseCode = null;
        this.CardType = null;
        this.Currency = null;
        this.ExpiryDate = null;
        this.FromDate = null;
        this.MerchantReference = null;
        this.MaskedCardNumber = null;
        this.RRN = null;
        this.ReceiptNumber = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.ResponseCode = null;
        this.BillerCode = null;
        this.SettlementDate = null;
        this.Source = null;
        this.ToDate = null;
        this.TxnNumber = null;
        this._method = "POST";
        this._url = "/txns/search";
        
        populate(args, this);
    }
    
    TxnSearch.prototype = new Request();
    
    TxnSearch.prototype.payload = function() {
        return { SearchInput : _stripPrivate(this) };
    };
    
    function TxnAuthKey(args) {
            this.Action = null;
            this.Amount = 0;
            this.AmountOriginal = 0;
            this.AmountSurcharge = 0;
            this.Currency = null;
            this.MerchantReference = null;
            this.Crn1 = null;
            this.Crn2 = null;
            this.Crn3 = null;
            this.BillerCode = null;
            this.TestMode = false;
            this.RedirectionUrl = null;
            this.WebHookUrl = null;
            this.HppParameters = null;
            this.Order = null;
            this.Customer = null;
            this.Type = null;
            this.TokenisationMode = 0;
            this.DVTokenData = null;
            this.SubType = null;
            this.EmailAddress = null;
            this.FraudScreeningRequest = null;
            this.AmexExpressCheckout = false;
            this._url = "/txns/processtxnauthkey";
            this._method = "POST";
            this.IframeParameters = null;
            this.BypassThreeDS = false;
            this.StatementDescriptor = null;
            
            populate(args, this);
    }
    
    TxnAuthKey.prototype = new Request();
    
    TxnAuthKey.prototype.payload = function() {
        
        var payload = { 
            HppParameters: this.HppParameters,
            ProcessTxnData:
            { 
                Action : this.Action,
                Amount : this.Amount, 
                Currency: this.Currency,
                Customer: this.Customer,
                MerchantReference : this.MerchantReference,
                Order: this.Order,
                AmountOriginal : this.AmountOriginal,
                AmountSurcharge: this.AmountSurcharge,
                Crn1 : this.Crn1, 
                Crn2 : this.Crn2,
                Crn3 : this.Crn3,
                BillerCode: this.BillerCode,
                TokenisationMode: this.TokenisationMode,
                DVTokenData: this.DVTokenData,
                TestMode : this.TestMode,
                SubType: this.SubType,
                Type: this.Type,
                FraudScreeningRequest: this.FraudScreeningRequest,
                StatementDescriptor: this.StatementDescriptor,
                AmexExpressCheckout: this.AmexExpressCheckout,
                EmailAddress: this.EmailAddress,
                BypassThreeDS: this.BypassThreeDS
            },
            WebHookUrl : this.WebHookUrl,
            RedirectionUrl : this.RedirectionUrl,
            IframeParameters :this.IframeParameters
        };
        return payload;
    };
    
    function TxnResultKey(resultKey) {
        this._url = "/txns/withauthkey/" + resultKey;
        this._method = "GET";
    }
    
    TxnResultKey.prototype = new Request();
    
    function ProcessTxnWithAuthKeyReq(args){
        this.TxnRequestWithAuthKey = null;
        populate(args, this);
    
    }
    
    ProcessTxnWithAuthKeyReq.prototype = new Request();
    
    ProcessTxnWithAuthKeyReq.prototype.payload = function() {
        return { TxnReq: _stripPrivate(this.TxnRequestWithAuthKey)};
    };
    
    function DVTokenRequest(args) {
        this.BankAccountDetails = null;
        this.CardDetails = null;
        this.EmailAddress = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.AcceptBADirectDebitTC = false;
        
        this._url = "/dvtokens/";
        this._method = "POST";
        
        populate(args, this);
    }
    
    DVTokenRequest.prototype = new Request();
    
    DVTokenRequest.prototype.payload = function() {
        return { DVTokenReq : _stripPrivate(this) };
    };
    
    function TokenUpdate(args) {
        DVTokenRequest.call(this, args);
        
        this._url = "/dvtokens/" + args.DVToken;
        this._method = "PUT";
    }
    
    TokenUpdate.prototype = new DVTokenRequest();

    function AddDVTokenViaIframe(args) {
        DVTokenRequest.call(this, args);
        
        this._url = "/dvtokens/iframe/add/" + args.AuthKey;
        this._method = "POST";
    }
    
    AddDVTokenViaIframe.prototype = new DVTokenRequest();
    
    function UpdateDVTokenViaIframe(args) {
        DVTokenRequest.call(this, args);
        
        this._url = "/dvtokens/iframe/update/" + args.AuthKey;
        this._method = "POST";
    }
    
    UpdateDVTokenViaIframe.prototype = new DVTokenRequest();
    
    function RetrieveToken(DVToken) {
        this._url = "/dvtokens/" + DVToken;
        this._method = "GET";
    }
    
    RetrieveToken.prototype = new Request();
    
    function ProcessIframeTxn(authKey, args){
        this._url = "/txns/processiframetxn/" + authKey;
        this._method = "POST";
        
        this.ProcessTxnWithAuthKeyReq = null;
        
        populate(args, this);
    }
    
    ProcessIframeTxn.prototype = new Request();
    
    ProcessIframeTxn.prototype.payload = function() {
        return this.ProcessTxnWithAuthKeyReq.payload();
    };

    function TokeniseTransaction(txnNo) {
        this._url = "/dvtokens/txn/" + txnNo;
        this._method = "POST";
    }
    
    TokeniseTransaction.prototype = new Request();
    
    function SearchTokens(args) {
        this.CardType = null;
        this.ExpiredCardsOnly = false;
        this.ExpiryDate = null;
        this.FromDate = null;
        this.MaskedCardNumber = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.Source = null;
        this.ToDate = null;
        this.DVToken = null;
        this.UserCreated = null;
        this.UserUpdated = null;
        
        this._method = "POST";
        this._url = "/dvtokens/search";
        
        populate(args, this);
    }
    
    SearchTokens.prototype = new Request();
    SearchTokens.prototype.payload = function() {
        return { SearchInput : _stripPrivate(this) };
    };
    
    function DeleteToken(DVToken) {
        this._url = "/dvtokens/" + DVToken;
        this._method = "DELETE";
    }
    
    DeleteToken.prototype = new Request();
    
    function AddDVTokenAuthKey(args) {
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.EmailAddress = null;
        this.HppParameters = null;
        this.WebHookUrl = null;
        this.RedirectionUrl = null;
        this.IframeParameters = null;
        this._url = "/dvtokens/adddvtokenauthkey";
        this._method = "POST";
        
        populate(args, this);
    }
    
    AddDVTokenAuthKey.prototype = new Request();
    AddDVTokenAuthKey.prototype.payload = function() {
        var payload = { 
            FixedAddDVTokenData:
            { 
                Crn1 : this.Crn1,
                Crn2 : this.Crn2, 
                Crn3 : this.Crn3,
                EmailAddress: this.EmailAddress
            },
            HppParameters : this.HppParameters,
            WebHookUrl : this.WebHookUrl,
            RedirectionUrl : this.RedirectionUrl,
            IframeParameters : this.IframeParameters
        };
        
        return payload;
    }
    
    function UpdateDVTokenAuthKey(args) {
        AddDVTokenAuthKey.call(this);
        this.DVToken = null;
        
        this._url = "/dvtokens/updatedvtokenauthkey";
        this._method = "POST";
        
        populate(args, this);
    }
    
    UpdateDVTokenAuthKey.prototype = new AddDVTokenAuthKey();
    
    UpdateDVTokenAuthKey.prototype.payload = function() {
        var payload = AddDVTokenAuthKey.prototype.payload.call(this);
        payload.FixedUpdateDVTokenData = payload.FixedAddDVTokenData;
        payload.FixedUpdateDVTokenData.DVToken = this.DVToken;
        delete payload.FixedAddDVTokenData;
        
        return payload;
    }
    
    function TokenResultKey(resultKey) {
        this._url = "/dvtokens/withauthkey/" + resultKey;
        this._method = "GET";
    }
    
    TokenResultKey.prototype = new Request();
    
    function CreateSecureCallAuthKeyRequest(args) {
        this.SecureCallRequest = null;
        this.WebHookUrl = null;
        
        this._url = "/ivr/addsecurecallauthkey";
        this._method = "POST";
        
        populate(args, this);
    }
    
    CreateSecureCallAuthKeyRequest.prototype = new Request();
    
    CreateSecureCallAuthKeyRequest.prototype.payload = function() {
        return _stripPrivate(this);
    };
    
    function InitiateSecureCallRequest(authKey) {
        this._url = "/ivr/securecall/" + authKey;
        this._method = "POST";
        
        populate(args, this);
    }
    
    InitiateSecureCallRequest.prototype = new Request();
    
    InitiateSecureCallRequest.prototype.payload = function() {
        return _stripPrivate(this);
    };

    function InitiateSecureCallActionRequest(authKey, args) {
        this.Action = null;
        
        this._url = "/ivr/securecall/action/" + authKey;
        this._method = "POST";
		
		populate(args, this);
    }
    
    InitiateSecureCallActionRequest.prototype = new Request();
    
    InitiateSecureCallActionRequest.prototype.payload = function() {
        return _stripPrivate(this);
    };

    function GetSecureCallDetails(authKey, args)  {
        this._url = "/ivr/securecall/" + authKey;
        this._method = "GET";
    }
	
	GetSecureCallDetails.prototype = new Request();

    function ProcessSecureCallTxn(authKey, args)  {
        this.TxnReq = null;
		
        this._url = "/ivr/securecall/processtxn/" + authKey;
        this._method = "POST";

        populate(args, this);
    }
    
    ProcessSecureCallTxn.prototype = new Request();
    
    ProcessSecureCallTxn.prototype.payload = function() {
        return _stripPrivate(this);
    };
	
	function SecureCallTxnRequest(args) {
		this.Action = null;
		this.EmailAddress = null;
		this.Amount = 0;
		this.AmountOriginal = 0;
		this.AmountSurcharge = 0;
		this.Currency = null;
		this.Customer = null;
		this.MerchantReference = null;
		this.MerchantNumber = null;
		this.Order = null;
		this.Crn1 = null;
		this.Crn2 = null;
		this.Crn3 = null;
		this.BillerCode = null;
		this.StoreCard = null;
		this.SubType = null;
		this.TestMode = false;
		this.TokenisationMode = 0;
		this.Type = null;
		this.FraudScreeningRequest = null;

        populate(args, this);
    }
	
	function SecureCallDVTokenRequest(args) {
        this.Crn1 = null;
		this.Crn2 = null;
		this.Crn3 = null;
		this.EmailAddress = null;
		this.MerchantNumber = null;
		this.DVToken = null;
		
        populate(args, this);
    }

    function AddSecureCallDVToken(authKey, args)  {
        this.TokenReq = null;

        this._url = "/ivr/securecall/addtoken/" + authKey;
        this._method = "POST";

        populate(args, this);
    }
    
    AddSecureCallDVToken.prototype = new Request();
    
    AddSecureCallDVToken.prototype.payload = function() {
        return _stripPrivate(this);
    };

    function UpdateSecureCallDVToken(authKey, args)  {
        this.TokenReq = null;
        
        this._url = "/ivr/securecall/updatetoken/" + authKey;
        this._method = "POST";

        populate(args, this);
    }
    
    UpdateSecureCallDVToken.prototype = new Request();
    
    UpdateSecureCallDVToken.prototype.payload = function() {
        return _stripPrivate(this);
    };

    function SystemStatus() {
        this._url = "/status/";
        this._method = "GET";
    }
    
    SystemStatus.prototype = new Request();

    function CreatePaymentRequest(args) {
        this._url = "/payreq";
        this._method = "POST";

        this.AcceptablePaymentType = null;
        this.Action = null;
        this.Amount = null;
        this.BillerCode = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.Currency = null;
        this.DueDate = null;
        this.DVToken = null;
        this.EmailAddress = null;
        this.EmailSenderName = null;
        this.ExpiryDate = null;
        this.MerchantReference = null;
        this.MessagingMode = null;
        this.MobilePhoneNumber = null;
        this.MobilePhoneNumberCountryCode = null;

        populate(args, this);
    }

    CreatePaymentRequest.prototype = new Request();

    CreatePaymentRequest.prototype.payload = function() {
        return { PaymentRequestReq: _stripPrivate(this) };
    };


    function SearchPaymentRequest(args) {
        this._url = "/payreq/search";
        this._method = "POST";

        this.Action = null;
        this.BillerCode = null;
        this.Crn1 = null;
        this.Crn2 = null;
        this.Crn3 = null;
        this.DVToken = null;
        this.EmailAddress = null;
        this.EmailSenderName = null;
        this.FromAmount = null;
        this.FromAmountOutstanding = null;
        this.FromAmountPaid = null;
        this.FromDate = null;
        this.FromDueDate = null;
        this.FromExpiryDate = null;
        this.Guid = null;
        this.MerchantReference = null;
        this.MobilePhoneNumber = null;
        this.ToAmount = null;
        this.ToAmountOutstanding = null;
        this.ToAmountPaid = null;
        this.ToDate = null;
        this.ToDueDate = null;
        this.ToExpiryDate = null;

        populate(args, this);
    }

    SearchPaymentRequest.prototype = new Request();

    SearchPaymentRequest.prototype.payload = function() {
        return { SearchInput: _stripPrivate(this) };
    };

    function ResendPaymentRequest(guid) {
        this._url = "/payreq/resend/" + guid;
        this._method = "POST";
    }

    ResendPaymentRequest.prototype = new Request();

    function UpdatePaymentRequest(args) {
        this._url = "/payreq/update";
        this._method = "POST";

        this.AcceptablePaymentType = null;
        this.Amount = null;
        this.DueDate = null;
        this.EmailAddress = null;
        this.Guid = null;

        populate(args, this);
    }

    UpdatePaymentRequest.prototype = new Request();

    UpdatePaymentRequest.prototype.payload = function() {
        return { PaymentRequestReq: _stripPrivate(this) };
    };

    function CancelPaymentRequest(guid) {
        this._url = "/payreq/cancel/" + guid;
        this._method = "POST";
    }

    CancelPaymentRequest.prototype = new Request();
    
    function CardDetails(args) {
        if (args !== undefined) {
            if (args.MaskedCardNumber !== undefined) {
                this.MaskedCardNumber = null;
            } else {
                this.CardNumber = null;
                this.Cvn = null;
            }
            
            this.ExpiryDate = null;
            this.CardHolderName = null;
            
            populate(args, this);
        }
    }
    
    function AuthKeyCardDetails(args) {
        if (args !== undefined) {
            this.ExpiryDateMonth = null;
            this.ExpiryDateYear = null;
            this.CardHolderName = null;
            
            populate(args, this);
        }
    }
    
    function HppTxnFlowParameters(args) {
        this.TokeniseTxnCheckBoxDefaultValue = false;
        this.HideBillerCode = false;
        this.HideCrn1 = false;
        this.HideCrn2 = false;
        this.HideCrn3 = false;
        this.ReturnBarLabel = null;
        this.ReturnBarUrl = null;
        
        populate(args, this);
    }
    
    function Customer(args) {
        this.Address = null;
        this.ContactDetails = null;
        this.PersonalDetails = null;
        this.CustomerNumber = null;
        this.DaysOnFile = 0;
        this.ExistingCustomer = false;
        
        populate(args, this);
    }
    
    function PersonalDetails(args) {
        this.DateOfBirth = null;
        this.FirstName = null;
        this.LastName = null;
        this.MiddleName = null;
        this.Salutation = null;
        
        populate(args, this);
    }
    
    function ContactDetails(args) {
        this.EmailAddress = null;
        this.FaxNumber = null;
        this.HomePhoneNumber = null;
        this.MobilePhoneNumber = null;
        this.WorkPhoneNumber = null;
        
        populate(args, this);
    }
    
    function Address(args) {
        this.AddressLine1 = null;
        this.AddressLine2 = null;
        this.AddressLine3 = null;
        this.City = null;
        this.CountryCode = null;
        this.PostCode = null;
        this.State = null;
        
        populate(args, this);
    }
    
    function Order(args) {
        this.BillingAddress = null;
        this.ShippingAddress = null;
        this.ShippingMethod = null;
        this.OrderRecipients = null;
        this.OrderItems = null;
        
        populate(args, this);
    }
    
    function OrderAddress(args) {
        this.Address = null;
        this.ContactDetails = null;
        this.PersonalDetails = null;
        
        populate(args, this);
    }
    
    function OrderItem(args) {
        this.Comments = null;
        this.Description = null;
        this.GiftMessage = null;
        this.PartNumber = null;
        this.ProductCode = null;
        this.Quantity = null;
        this.SKU = null;
        this.ShippingMethod = null;
        this.ShippingNumber = null;
        this.UnitPrice = null;
        
        populate(args, this);
    }
    
    function OrderRecipient(args) {
        this.Address = null;
        this.ContactDetails = null;
        this.PersonalDetails = null;
        
        populate(args, this);
    }
    
    function CustomField(args) {
        this.CustomField = null;
        
        populate(args, this);
    }
    
    function FraudScreeningRequest(args){
        this.PerformFraudScreening = false;
        this.FraudScreeningDeviceFingerprint = null;
        this.CustomerIPAddress = null;
        this.SourceWebsiteURL = null;
        this.CustomFields = null;
        
        populate(args, this);
    }

    function StatementDescriptor(args){
        this.AddressLine1 = null;
        this.AddressLine2 = null;
        this.City = null;
        this.CompanyName = null;
        this.CountryCode = null;
        this.MerchantName = null;
        this.PhoneNumber = null;
        this.PostCode = null;
        this.State = null;
        
        populate(args, this);
    }
    
    function HppParameters(args) {
        this.HideCrn1 = false;
        this.HideCrn2 = false;
        this.HideCrn3 = false;
        this.IsEddr = false;
        this.Crn1Label = null;
        this.Crn2Label = null;
        this.Crn3Label = null;
        this.BillerCode = null;
        this.ShowCustomerDetailsForm = false;
        this.ReturnBarLabel = null;
        this.ReturnBarUrl = null;
        
        populate(args, this);
    }
    
    function IframeParameters(args) {
        this.CSS = null;
        this.ShowSubmitButton = false;
        
        populate(args, this);
    }
    
    function DVTokenData(args) {
        this.DVToken = null;
        this.ExpiryDate = null;
        this.UpdateDVTokenExpiryDate = false;
        
        populate(args, this);
    }
    
    function SecureCallRequest(args) {
        this.Agent = null;
        this.AgentPhoneNumber = null;
        this.BillerCode = null;

        populate(args, this);
    }
    
    return {
        CardDetails : CardDetails,
        HppParameters : HppParameters,
        TxnRequest : TxnRequest,
        TxnFetch : TxnFetch,
        TxnSearch : TxnSearch,
        TxnAuthKey : TxnAuthKey,
        TxnResultKey : TxnResultKey,
        DVTokenRequest: DVTokenRequest,
        TokenUpdate: TokenUpdate,
        TokeniseTransaction : TokeniseTransaction,
        RetrieveToken : RetrieveToken,
        SearchTokens : SearchTokens,
        DeleteToken : DeleteToken,
        AddDVTokenAuthKey : AddDVTokenAuthKey,
        UpdateDVTokenAuthKey : UpdateDVTokenAuthKey,
        TokenResultKey : TokenResultKey,
        SystemStatus : SystemStatus,
        Address : Address,
        ContactDetails : ContactDetails,
        PersonalDetails : PersonalDetails,
        Customer : Customer,
        OrderAddress : OrderAddress,
        OrderItem : OrderItem,
        OrderRecipient : OrderRecipient, Order: Order,
        FraudScreeningRequest : FraudScreeningRequest,
        CustomField : CustomField,
        StatementDescriptor : StatementDescriptor,
        HppTxnFlowParameters : HppTxnFlowParameters,
        IframeParameters : IframeParameters,
        ProcessIframeTxn : ProcessIframeTxn,
        TxnRequestWithAuthKey : TxnRequestWithAuthKey,
        ProcessTxnWithAuthKeyReq : ProcessTxnWithAuthKeyReq,
        AuthKeyCardDetails : AuthKeyCardDetails,
        DVTokenDat : DVTokenData,
        AddDVTokenViaIframe : AddDVTokenViaIframe,
        UpdateDVTokenViaIframe : UpdateDVTokenViaIframe,
        SecureCallRequest: SecureCallRequest,
        CreateSecureCallAuthKeyRequest : CreateSecureCallAuthKeyRequest,
        InitiateSecureCallRequest : InitiateSecureCallRequest, 
        InitiateSecureCallActionRequest : InitiateSecureCallActionRequest,
        GetSecureCallDetails : GetSecureCallDetails,
        ProcessSecureCallTxn : ProcessSecureCallTxn,
        AddSecureCallDVToken : AddSecureCallDVToken,
        UpdateSecureCallDVToken : UpdateSecureCallDVToken,
		SecureCallTxnRequest : SecureCallTxnRequest,
		SecureCallDVTokenRequest : SecureCallDVTokenRequest,
        CreatePaymentRequest : CreatePaymentRequest,
        SearchPaymentRequest : SearchPaymentRequest,
        ResendPaymentRequest : ResendPaymentRequest,
        UpdatePaymentRequest : UpdatePaymentRequest,
        CancelPaymentRequest : CancelPaymentRequest
    };
}
