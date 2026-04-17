def check_fraud(data, device_claim_count_24h):
    is_desktop_test = data.get('desktop_test', False)

    # Rule ERR_01
    if not is_desktop_test and float(data.get('gyroscope_variance', 0)) == 0.0:
        return 403, {"error": "ERR_01", "reason": "Emulator detected", "outcome": "REJECTED"}

    # Rule ERR_02
    if not is_desktop_test and float(data.get('ip_to_gps_distance_km', 0)) > 100:
        return 403, {"error": "ERR_02", "reason": "VPN or proxy detected", "outcome": "REJECTED"}

    # Rule ERR_03
    if not is_desktop_test and device_claim_count_24h > 2:
        return 403, {"error": "ERR_03", "reason": "Device farm detected", "outcome": "REJECTED"}

    # Rule ERR_04
    if not is_desktop_test and float(data.get('html5_accuracy_meters', 0)) > 1500:
        return 202, {"status": "MANUAL_AUDIT", "message": "Location unverified. Submit photo proof.", "outcome": "MANUAL_AUDIT"}

    return 200, {"status": "APPROVED", "message": "Payout initiated.", "outcome": "APPROVED"}
