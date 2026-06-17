import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;

import '../../../core/app_colors.dart';
import '../../../models/trip.dart';
import '../../../providers/trip_provider.dart';

/// Lets a driver log Fuel, Payout, Operating, and Other expenses for a
/// trip. Locked once the trip is completed or cancelled.
class TripExpensesScreen extends StatelessWidget {
  final String tripId;

  const TripExpensesScreen({super.key, required this.tripId});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Trip Expenses')),
      body: Consumer<TripProvider>(
        builder: (context, trips, _) {
          final trip = trips.trips.where((t) => t.id == tripId);
          if (trip.isEmpty) {
            return const Center(child: Text('Trip not found'));
          }
          return _ExpensesBody(trip: trip.first);
        },
      ),
    );
  }
}

class _ExpensesBody extends StatefulWidget {
  final Trip trip;

  const _ExpensesBody({required this.trip});

  @override
  State<_ExpensesBody> createState() => _ExpensesBodyState();
}

class _ExpensesBodyState extends State<_ExpensesBody> {
  late final TextEditingController _fuelController;
  late final TextEditingController _clerkController;
  late final TextEditingController _rtoRateController;
  late final TextEditingController _unloadingController;
  late final TextEditingController _liftOnController;
  late final TextEditingController _cfsController;
  late final TextEditingController _passController;
  late final TextEditingController _weightController;

  @override
  void initState() {
    super.initState();
    final expenses = context.read<TripProvider>().expensesFor(widget.trip.id);
    _fuelController = TextEditingController(text: _format(expenses.fuel));
    _clerkController = TextEditingController(text: _format(expenses.payout.clerkPayout));
    _rtoRateController = TextEditingController(text: _format(expenses.payout.rtoPcRate));
    _unloadingController = TextEditingController(text: _format(expenses.payout.unloading));
    _liftOnController = TextEditingController(text: _format(expenses.payout.liftOn));
    _cfsController = TextEditingController(text: _format(expenses.operating.cfs));
    _passController = TextEditingController(text: _format(expenses.operating.pass));
    _weightController = TextEditingController(text: _format(expenses.operating.weight));
  }

  @override
  void dispose() {
    _fuelController.dispose();
    _clerkController.dispose();
    _rtoRateController.dispose();
    _unloadingController.dispose();
    _liftOnController.dispose();
    _cfsController.dispose();
    _passController.dispose();
    _weightController.dispose();
    super.dispose();
  }

  String _format(double value) => value == 0 ? '' : _trimZeros(value);

  String _trimZeros(double value) {
    if (value == value.roundToDouble()) return value.toInt().toString();
    return value.toString();
  }

  double _parse(String text) => double.tryParse(text.trim()) ?? 0;

  Future<void> _showAddExpenseSheet(bool canEdit) async {
    if (!canEdit) return;
    final tripProvider = context.read<TripProvider>();

    final result = await showModalBottomSheet<Map<String, Object>>(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
      builder: (context) => const _AddExpenseSheet(),
    );

    if (result != null) {
      tripProvider.addOtherExpense(widget.trip.id, result['label'] as String, result['amount'] as double);
    }
  }

  @override
  Widget build(BuildContext context) {
    final tripProvider = context.watch<TripProvider>();
    final expenses = tripProvider.expensesFor(widget.trip.id);
    final canEdit = tripProvider.canEditExpenses(widget.trip.id);

    return ListView(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
      children: [
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      widget.trip.tripId,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                    ),
                    const Spacer(),
                    Text(
                      widget.trip.status.label,
                      style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Expanded(
                      child: Text(widget.trip.origin, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                    ),
                    const Icon(Icons.arrow_forward, size: 18, color: AppColors.gold),
                    Expanded(
                      child: Text(
                        widget.trip.destination,
                        textAlign: TextAlign.right,
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
        if (!canEdit) ...[
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.neutralChip,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                const Icon(Icons.lock_outline, size: 18, color: AppColors.textSecondary),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'This trip is completed. Expenses can no longer be edited.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary),
                  ),
                ),
              ],
            ),
          ),
        ],
        const SizedBox(height: 12),
        _TotalExpenseCard(total: expenses.total),
        const SizedBox(height: 16),
        _SectionCard(
          title: 'Fuel',
          children: [
            _AmountField(
              label: 'Diesel Purchased',
              controller: _fuelController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updateFuel(widget.trip.id, _parse(value)),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _SectionCard(
          title: 'Payout',
          subtotal: expenses.payout.total,
          children: [
            _AmountField(
              label: 'Clerk Payout',
              controller: _clerkController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updatePayout(
                widget.trip.id,
                (p) => p.copyWith(clerkPayout: _parse(value)),
              ),
            ),
            const SizedBox(height: 12),
            _AmountField(
              label: 'RTO/PC Payout (per unit)',
              controller: _rtoRateController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updatePayout(
                widget.trip.id,
                (p) => p.copyWith(rtoPcRate: _parse(value)),
              ),
            ),
            const SizedBox(height: 8),
            _QuantityStepper(
              label: 'Quantity',
              quantity: expenses.payout.rtoPcQuantity,
              enabled: canEdit,
              onChanged: (qty) => tripProvider.updatePayout(
                widget.trip.id,
                (p) => p.copyWith(rtoPcQuantity: qty),
              ),
            ),
            if (expenses.payout.rtoPcTotal > 0) ...[
              const SizedBox(height: 4),
              Text(
                'RTO/PC Total: ₹${_trimZeros(expenses.payout.rtoPcTotal)}',
                style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
              ),
            ],
            const SizedBox(height: 12),
            _AmountField(
              label: 'Unloading',
              controller: _unloadingController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updatePayout(
                widget.trip.id,
                (p) => p.copyWith(unloading: _parse(value)),
              ),
            ),
            const SizedBox(height: 12),
            _AmountField(
              label: 'Lift-On',
              controller: _liftOnController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updatePayout(
                widget.trip.id,
                (p) => p.copyWith(liftOn: _parse(value)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _SectionCard(
          title: 'Operating Expenses',
          subtotal: expenses.operating.total,
          children: [
            _AmountField(
              label: 'CFS',
              controller: _cfsController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updateOperating(
                widget.trip.id,
                (o) => o.copyWith(cfs: _parse(value)),
              ),
            ),
            const SizedBox(height: 12),
            _AmountField(
              label: 'PASS',
              controller: _passController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updateOperating(
                widget.trip.id,
                (o) => o.copyWith(pass: _parse(value)),
              ),
            ),
            const SizedBox(height: 12),
            _AmountField(
              label: 'Weight',
              controller: _weightController,
              enabled: canEdit,
              onChanged: (value) => tripProvider.updateOperating(
                widget.trip.id,
                (o) => o.copyWith(weight: _parse(value)),
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        _SectionCard(
          title: 'Other Expenses',
          subtotal: expenses.otherTotal,
          children: [
            if (expenses.otherExpenses.isEmpty)
              const Text(
                'No other expenses added yet.',
                style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
              )
            else
              ...expenses.otherExpenses.map(
                (item) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(item.label, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                      ),
                      Text(
                        '₹${_trimZeros(item.amount)}',
                        style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600),
                      ),
                      if (canEdit)
                        IconButton(
                          icon: const Icon(Icons.close, size: 18, color: AppColors.danger),
                          onPressed: () => tripProvider.removeOtherExpense(widget.trip.id, item.id),
                        ),
                    ],
                  ),
                ),
              ),
            const SizedBox(height: 4),
            OutlinedButton.icon(
              onPressed: canEdit ? () => _showAddExpenseSheet(canEdit) : null,
              icon: const Icon(Icons.add, size: 18),
              label: const Text('Add Expense'),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                side: const BorderSide(color: AppColors.primary),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _TotalExpenseCard extends StatelessWidget {
  final double total;

  const _TotalExpenseCard({required this.total});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.gold,
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(Icons.receipt_long, color: AppColors.primary, size: 20),
          ),
          const SizedBox(width: 12),
          const Expanded(
            child: Text(
              'Total Expense',
              style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.w600),
            ),
          ),
          Text(
            '₹${total == total.roundToDouble() ? total.toInt() : total.toStringAsFixed(2)}',
            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800),
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final double? subtotal;
  final List<Widget> children;

  const _SectionCard({required this.title, required this.children, this.subtotal});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  title,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary),
                ),
                const Spacer(),
                if (subtotal != null)
                  Text(
                    '₹${subtotal == subtotal!.roundToDouble() ? subtotal!.toInt() : subtotal!.toStringAsFixed(2)}',
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textSecondary),
                  ),
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _AmountField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final bool enabled;
  final ValueChanged<String> onChanged;

  const _AmountField({
    required this.label,
    required this.controller,
    required this.enabled,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: controller,
      enabled: enabled,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),
      decoration: InputDecoration(labelText: label, prefixText: '₹ '),
      onChanged: onChanged,
    );
  }
}

class _QuantityStepper extends StatelessWidget {
  final String label;
  final int quantity;
  final bool enabled;
  final ValueChanged<int> onChanged;

  const _QuantityStepper({
    required this.label,
    required this.quantity,
    required this.enabled,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(label, style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
        ),
        _StepperButton(
          icon: Icons.remove,
          onPressed: enabled && quantity > 0 ? () => onChanged(quantity - 1) : null,
        ),
        SizedBox(
          width: 36,
          child: Text(
            '$quantity',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
          ),
        ),
        _StepperButton(
          icon: Icons.add,
          onPressed: enabled ? () => onChanged(quantity + 1) : null,
        ),
      ],
    );
  }
}

class _StepperButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback? onPressed;

  const _StepperButton({required this.icon, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: AppColors.primarySoft,
      borderRadius: BorderRadius.circular(8),
      child: InkWell(
        borderRadius: BorderRadius.circular(8),
        onTap: onPressed,
        child: Padding(
          padding: const EdgeInsets.all(6),
          child: Icon(icon, size: 16, color: onPressed == null ? AppColors.textSecondary : AppColors.primary),
        ),
      ),
    );
  }
}

/// Languages offered for voice input on the expense description field.
enum _VoiceLanguage {
  english('English', 'en_IN'),
  tamil('தமிழ்', 'ta_IN'),
  hindi('हिन्दी', 'hi_IN');

  final String label;
  final String localeId;

  const _VoiceLanguage(this.label, this.localeId);
}

/// Bottom sheet for logging a one-off "Other Expense", with a voice
/// input option (English, Tamil, Hindi) for the description field.
class _AddExpenseSheet extends StatefulWidget {
  const _AddExpenseSheet();

  @override
  State<_AddExpenseSheet> createState() => _AddExpenseSheetState();
}

class _AddExpenseSheetState extends State<_AddExpenseSheet> {
  final _labelController = TextEditingController();
  final _amountController = TextEditingController();
  final _speech = stt.SpeechToText();

  bool _speechAvailable = false;
  bool _isListening = false;
  _VoiceLanguage _language = _VoiceLanguage.english;

  @override
  void initState() {
    super.initState();
    _speech.initialize().then((available) {
      if (mounted) setState(() => _speechAvailable = available);
    });
  }

  @override
  void dispose() {
    _speech.stop();
    _labelController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _toggleListening() async {
    if (_isListening) {
      await _speech.stop();
      if (mounted) setState(() => _isListening = false);
      return;
    }

    if (!_speechAvailable) return;

    setState(() => _isListening = true);
    await _speech.listen(
      listenOptions: stt.SpeechListenOptions(localeId: _language.localeId),
      onResult: (result) {
        setState(() {
          _labelController.text = result.recognizedWords;
          _labelController.selection = TextSelection.collapsed(offset: _labelController.text.length);
          if (result.finalResult) _isListening = false;
        });
      },
    );
  }

  void _submit() {
    final label = _labelController.text.trim();
    final amount = double.tryParse(_amountController.text.trim()) ?? 0;
    if (label.isEmpty || amount <= 0) return;
    Navigator.of(context).pop(<String, Object>{'label': label, 'amount': amount});
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 24, 20, 32 + MediaQuery.of(context).viewInsets.bottom),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 64,
              height: 64,
              decoration: const BoxDecoration(color: AppColors.primarySoft, shape: BoxShape.circle),
              child: const Icon(Icons.receipt_long, color: AppColors.primary, size: 28),
            ),
          ),
          const SizedBox(height: 16),
          const Center(
            child: Text('Add Expense', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
          ),
          const SizedBox(height: 6),
          const Center(
            child: Text(
              'Describe the expense and enter the amount spent.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
            ),
          ),
          const SizedBox(height: 20),
          const Text('Description', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _labelController,
            textCapitalization: TextCapitalization.sentences,
            decoration: InputDecoration(
              hintText: 'e.g. Puncture repair',
              suffixIcon: IconButton(
                icon: Icon(
                  _isListening ? Icons.mic : Icons.mic_none,
                  color: _isListening ? AppColors.danger : AppColors.primary,
                ),
                onPressed: _speechAvailable ? _toggleListening : null,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: _VoiceLanguage.values.map((lang) {
              return ChoiceChip(
                label: Text(lang.label),
                selected: _language == lang,
                onSelected: (_) => setState(() => _language = lang),
              );
            }).toList(),
          ),
          if (_isListening) ...[
            const SizedBox(height: 10),
            Row(
              children: [
                const SizedBox(
                  width: 14,
                  height: 14,
                  child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                ),
                const SizedBox(width: 8),
                Text(
                  'Listening in ${_language.label}...',
                  style: const TextStyle(fontSize: 12, color: AppColors.textSecondary),
                ),
              ],
            ),
          ],
          const SizedBox(height: 20),
          const Text('Amount', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
          const SizedBox(height: 8),
          TextField(
            controller: _amountController,
            keyboardType: const TextInputType.numberWithOptions(decimal: true),
            decoration: const InputDecoration(prefixText: '₹ ', hintText: '0'),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _submit,
            child: const Text('Add Expense'),
          ),
        ],
      ),
    );
  }
}
