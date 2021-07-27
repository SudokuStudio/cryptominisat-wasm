#!/bin/bash
set -ex

# Get cryptominisat
if [ ! -d "cryptominisat" ]; then
    git clone https://github.com/msoos/cryptominisat.git
fi
pushd cryptominisat

cat << EOF >> src/CMakeLists.txt
set_target_properties(cryptominisat5_simple-bin
PROPERTIES
OUTPUT_NAME cryptominisat5_simple
LINK_FLAGS "\
    -s WASM=1 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' \
    -s EXPORTED_FUNCTIONS=_cstart_solve,_ccontinue_solve,_cget_num_conflicts,_cmsat_new,_cmsat_free,_cmsat_nvars,_cmsat_add_clause,_cmsat_add_xor_clause,_cmsat_new_vars,_cmsat_solve,_cmsat_solve_with_assumptions,_cmsat_get_model,_cmsat_get_conflict,_cmsat_print_stats,_cmsat_set_num_threads,_cmsat_set_verbosity,_cmsat_set_default_polarity,_cmsat_set_polarity_auto,_cmsat_set_no_simplify,_cmsat_set_no_simplify_at_startup,_cmsat_set_no_equivalent_lit_replacement,_cmsat_set_no_bva,_cmsat_set_no_bve,_cmsat_set_up_for_scalmc,_cmsat_set_yes_comphandler,_cmsat_simplify,_cmsat_set_max_time"
)

SET_SOURCE_FILES_PROPERTIES(main_emscripten.cpp
    PROPERTIES COMPILE_FLAGS "\
    -s WASM=1 -s EXPORT_ES6=1 -s ALLOW_MEMORY_GROWTH=1 \
    -s EXTRA_EXPORTED_RUNTIME_METHODS='[\"ccall\", \"cwrap\"]' \
    -s EXPORTED_FUNCTIONS=_cstart_solve,_ccontinue_solve,_cget_num_conflicts"
)
EOF

mkdir build || true
pushd build

# Get the emsdk repo
if [ ! -d "emsdk" ]; then
    git clone https://github.com/emscripten-core/emsdk.git
fi

# Enter that directory
pushd emsdk

# Download and install the latest SDK tools.
./emsdk install latest

# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest

# Activate PATH and other environment variables in the current terminal
source ./emsdk_env.sh

popd

emcmake cmake -DEMSCIPTEN=ON -DNOM4RI=ON \
    -DENABLE_TESTING=OFF -DEXTFEAT=OFF -DSTATS=OFF \
    ..

emmake make

popd
popd
