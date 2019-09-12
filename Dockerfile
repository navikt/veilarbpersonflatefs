FROM navikt/pus-fss-frontend
COPY --from=builder /source/build /app
