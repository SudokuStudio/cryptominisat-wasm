import loadWasm from './cryptominisat5_simple';

const LBool = {
    TRUE: 0,
    FALSE: 1,
    UNDEF: 2,
};

function load() {
    return loadWasm().then((rawModule) => {
        const module = Object.assign(rawModule, bind(rawModule));
        return module;
    });
}
function bind(Module) {
    return {
        cmsat_new() {
            return Module.ccall('cmsat_new', 'number');
        },
        cmsat_free(self) {
            return Module.ccall('cmsat_free', null, ['number'], [self]);
        },
        cmsat_nvars(self) {
            return Module.ccall('cmsat_nvars', 'number', ['number'], [self]);
        },
        cmsat_add_clause(self, lits) {
            const ptr = lits.length && Module._malloc(lits.length << 2);
            try {
                Module.HEAPU32.set(lits, ptr >> 2);
                return Module.ccall('cmsat_add_clause', 'number', ['number', 'number', 'number'], [self, ptr, lits.length]);
            }
            finally {
                if (0 !== ptr)
                    Module._free(ptr);
            }
        },
        cmsat_add_xor_clause(self, lits, rhs) {
            const ptr = lits.length && Module._malloc(lits.length << 2);
            try {
                Module.HEAPU32.set(lits, ptr >> 2);
                return Module.ccall('cmsat_add_xor_clause', 'number', ['number', 'number', 'number', 'boolean'], [self, ptr, lits.length, rhs]);
            }
            finally {
                if (0 !== ptr)
                    Module._free(ptr);
            }
        },
        cmsat_new_vars(self, n) {
            return Module.ccall('cmsat_new_vars', 'number', ['number', 'number'], [self, n]);
        },
        cmsat_solve(self) {
            return Module.ccall('cmsat_solve', 'number', ['number'], [self]);
        },
        cmsat_solve_with_assumptions(self, assumptions) {
            if (0 >= assumptions.length)
                return this.cmsat_solve(self);
            const ptr = Module._malloc(assumptions.length << 2);
            try {
                Module.HEAPU32.set(assumptions, ptr >> 2);
                return Module.ccall('cmsat_solve_with_assumptions', 'number', ['number', 'number', 'number'], [self, ptr, assumptions.length]);
            }
            finally {
                Module._free(ptr);
            }
        },
        cmsat_get_model(self) {
            const retPtr = Module._malloc(2 << 2);
            try {
                Module.ccall('cmsat_get_model', null, ['number', 'number'], [retPtr, self]);
                const ptr = Module.HEAPU32[(retPtr >> 2)];
                const len = Module.HEAPU32[(retPtr >> 2) + 1] << 0;
                return Module.HEAPU8.subarray(ptr, ptr + len);
            }
            finally {
                Module._free(retPtr);
            }
        },
        cmsat_get_conflict(self) {
            const retPtr = Module._malloc(2 << 2);
            try {
                Module.ccall('cmsat_get_conflict', null, ['number', 'number'], [retPtr, self]);
                const ptr = Module.HEAPU32[(retPtr >> 2)];
                const len = Module.HEAPU32[(retPtr >> 2) + 1] << 2;
                return Module.HEAPU32.subarray(ptr, ptr + len);
            }
            finally {
                Module._free(retPtr);
            }
        },
        cmsat_print_stats(self) {
            return Module.ccall('cmsat_print_stats', null, ['number'], [self]);
        },
        cmsat_set_num_threads(self, n) {
            return Module.ccall('cmsat_set_num_threads', null, ['number', 'number'], [self, n]);
        },
        cmsat_set_verbosity(self, n) {
            return Module.ccall('cmsat_set_verbosity', null, ['number', 'number'], [self, n]);
        },
        cmsat_set_default_polarity(self, polarity) {
            return Module.ccall('cmsat_set_default_polarity', null, ['number', 'number'], [self, polarity]);
        },
        cmsat_set_polarity_auto(self) {
            return Module.ccall('cmsat_set_polarity_auto', null, ['number'], [self]);
        },
        cmsat_set_no_simplify(self) {
            return Module.ccall('cmsat_set_no_simplify', null, ['number'], [self]);
        },
        cmsat_set_no_simplify_at_startup(self) {
            return Module.ccall('cmsat_set_no_simplify_at_startup', null, ['number'], [self]);
        },
        cmsat_set_no_equivalent_lit_replacement(self) {
            return Module.ccall('cmsat_set_no_equivalent_lit_replacement', null, ['number'], [self]);
        },
        cmsat_set_no_bva(self) {
            return Module.ccall('cmsat_set_no_bva', null, ['number'], [self]);
        },
        cmsat_set_no_bve(self) {
            return Module.ccall('cmsat_set_no_bve', null, ['number'], [self]);
        },
        cmsat_set_up_for_scalmc(self) {
            return Module.ccall('cmsat_set_up_for_scalmc', null, ['number'], [self]);
        },
        cmsat_set_yes_comphandler(self) {
            return Module.ccall('cmsat_set_yes_comphandler', null, ['number'], [self]);
        },
        cmsat_simplify(self, assumptions = []) {
            const ptr = assumptions.length && Module._malloc(assumptions.length << 2);
            try {
                Module.HEAPU32.set(assumptions, ptr >> 2);
                return Module.ccall('cmsat_simplify', 'number', ['number', 'number', 'number'], [self, ptr, assumptions.length]);
            }
            finally {
                if (0 !== ptr)
                    Module._free(ptr);
            }
        },
        cmsat_set_max_time(self, max_time) {
            return Module.ccall('cmsat_set_max_time', null, ['number', 'number'], [self, max_time]);
        },
    };
}

export { LBool, load };
